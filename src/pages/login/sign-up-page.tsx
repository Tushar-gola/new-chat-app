import { Box, Button, Card, Divider, FormControl, FormHelperText, FormLabel, Grid, IconButton, Input, Stack, styled, Typography } from '@mui/joy';
import { FacebookIcon, GoogleIcon } from '../../svgs';
import { useNavigate } from 'react-router-dom';
import { urls } from '../../routers/urls';
import { auth, provider } from '../../firebase/google';
import { signInWithPopup } from 'firebase/auth'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import { useFormik } from 'formik'
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { authValidationSchema } from '../../schemas';
import { useSignUpMutation } from '../../services';
import { useState } from 'react';
const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100vh', // Full viewport height
    display: 'flex',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));
const MuiCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '550px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));
const SignUpPage = () => {
    const navigate = useNavigate()
    const mutation = useSignUpMutation()
    const [passwordProtect, setPasswordProtect] = useState({ password: true, confirm: true })


    const { handleChange, handleSubmit, values, handleBlur, errors, touched } = useFormik({
        initialValues: {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            confirm_password: "",
            profile: "",
            login_by: "email",
            user_name: "",
            platform: navigator.platform,
            userAgent: navigator.userAgent
        },
        validationSchema: authValidationSchema,
        onSubmit: (value) => {
            mutation.mutate(value)
        }
    })
    const handleGoogleAuth = async () => {
        let data = await signInWithPopup(auth, provider)
        const { email, firstName, lastName, photoUrl } = data?._tokenResponse
        values.email = email
        values.first_name = firstName
        values.last_name = lastName
        values.profile = photoUrl
        values.login_by = 'google'
        values.user_name = firstName + lastName
        handleSubmit()
    }

    const handleVisiblity = (key: string, value: boolean) => {
        setPasswordProtect((prev) => {
            return { ...prev, [key]: value }
        })
    }

    return (
        <div>
            <SignInContainer direction="column" justifyContent="space-between">
                <MuiCard variant='outlined' color='primary'>
                    <Box component='form' onSubmit={handleSubmit} id='auth'>
                        <Typography
                            level='h4'
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 1.15rem)', color: "white" }}
                        >
                            Sign Up
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid xs={12} md={6}>
                                <FormControl error={errors.first_name && touched.first_name ? true : false}>
                                    <FormLabel>First name</FormLabel>
                                    <Input
                                        placeholder="Enter first name."
                                        onChange={handleChange}
                                        name='first_name'
                                        onBlur={handleBlur}
                                        value={values?.first_name}
                                    />
                                    {(errors.first_name && touched.first_name) && <FormHelperText >
                                        <InfoOutlined />
                                        {errors.first_name}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl error={errors.last_name && touched.last_name ? true : false}>
                                    <FormLabel>Last name</FormLabel>
                                    <Input
                                        placeholder="Enter last name"
                                        onChange={handleChange}
                                        name='last_name'
                                        onBlur={handleBlur}
                                        value={values?.last_name}
                                    />
                                    {(errors.last_name && touched.last_name) && <FormHelperText >
                                        <InfoOutlined />
                                        {errors.last_name}
                                    </FormHelperText>}

                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <FormControl error={errors.email && touched.email ? true : false}>
                                    <FormLabel>Gmail</FormLabel>
                                    <Input
                                        placeholder="Enter Email"
                                        onChange={handleChange}
                                        name='email'
                                        onBlur={handleBlur}
                                        value={values?.email}
                                    />
                                    {(errors.email && touched.email) && <FormHelperText >
                                        <InfoOutlined />
                                        {errors.email}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl error={(errors.password && touched.password) ? true : false}>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        placeholder="Enter password"
                                        onChange={handleChange}
                                        name='password'
                                        onBlur={handleBlur}
                                        value={values?.password}
                                        type={passwordProtect.password ? 'password' : "text"}
                                        endDecorator={<IconButton type='button' onClick={() => handleVisiblity('password', !passwordProtect.password)}>
                                            {passwordProtect.password ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                        </IconButton>}
                                    />
                                    {(errors.password && touched.password) && <FormHelperText >
                                        <InfoOutlined />
                                        {errors.password}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <FormControl error={(errors.confirm_password && touched.confirm_password) ? true : false}>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input
                                        placeholder="Enter Confirm password"
                                        onChange={handleChange}
                                        name='confirm_password'
                                        onBlur={handleBlur}
                                        value={values?.confirm_password}
                                        endDecorator={<IconButton type='button' onClick={() => handleVisiblity('confirm', !passwordProtect.password)}>
                                            {passwordProtect.confirm ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                        </IconButton>}
                                        type={passwordProtect.confirm ? 'password' : "text"}
                                    />
                                    {(errors.confirm_password && touched.confirm_password) && <FormHelperText >
                                        <InfoOutlined />
                                        {errors.confirm_password}
                                    </FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <FormControl error={(errors.user_name && touched.user_name) ? true : false}>
                                    <FormLabel>UserName</FormLabel>
                                    <Input
                                        placeholder="Enter username"
                                        onChange={handleChange}
                                        name='user_name'
                                        onBlur={handleBlur}
                                        value={values?.user_name}
                                    />
                                    {(errors.user_name && touched.user_name) && <FormHelperText >
                                        <InfoOutlined />
                                        {errors.user_name}
                                    </FormHelperText>}

                                </FormControl>
                            </Grid>
                            <Grid xs={12}>
                                <Button fullWidth variant='soft' form="auth" type='submit'>Sign Up</Button>
                            </Grid>
                            <Grid xs={12}>
                                <Typography textAlign='center'> Already have an account?{' '} <Typography sx={{ cursor: "pointer" }} level='title-md' onClick={() => navigate(urls.LOGIN)}>Sign In</Typography></Typography>
                            </Grid>
                            <Grid xs={12}>
                                <Divider>or</Divider>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <Button startDecorator={<GoogleIcon />} variant='soft' fullWidth onClick={handleGoogleAuth}>
                                    Sign in with Google
                                </Button>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <Button startDecorator={<FacebookIcon />} variant='soft' fullWidth>
                                    Sign in with Facebook
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>
                </MuiCard>
            </SignInContainer>

        </div >
    )
}

export { SignUpPage }
