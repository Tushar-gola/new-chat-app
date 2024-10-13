//@ts-nocheck
import { Box, Button, Card, Divider, FormControl, FormHelperText, FormLabel, Grid, IconButton, Input, Stack, styled, Typography } from '@mui/joy';
import React, { useState } from 'react'
import { FacebookIcon, GoogleIcon } from '../../svgs';
import { useNavigate } from 'react-router-dom';
import { urls } from '../../routers/urls';
import { useFormik } from 'formik';
import { useSignInMutation } from '../../services';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
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
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));
const LoginPage = () => {
    const navigate = useNavigate()
    const mutation = useSignInMutation()
    const [passwordProtect, setPasswordProtect] = useState({ password: true, confirm: true })

    const { handleChange, handleSubmit, values, handleBlur, errors, touched } = useFormik({
        initialValues: {
            email: "",
            password: "",
            login_by: "email",
        },
        onSubmit: (value) => {
            mutation.mutate(value)
        }
    })
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
                            Sign In
                        </Typography>
                        <Grid container spacing={2}>
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
                            <Grid xs={12}>
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
                            <Grid xs={12}>
                                <Button fullWidth variant='soft' form="auth" type='submit'>Sign In</Button>
                            </Grid>
                            <Grid xs={12}>
                                <Typography textAlign='center'>Don't have an account? <Typography sx={{ cursor: "pointer" }} level='title-md' onClick={() => navigate(urls.SIGNUP)}>Sign up</Typography></Typography>
                            </Grid>
                            <Grid xs={12}>
                                <Divider>or</Divider>
                            </Grid>
                            <Grid xs={12}>
                                <Button startDecorator={<GoogleIcon />} variant='soft' fullWidth>
                                    Sign in with Google
                                </Button>
                            </Grid>
                            <Grid xs={12}>
                                <Button startDecorator={<FacebookIcon />} variant='soft' fullWidth>
                                    Sign in with Facebook
                                </Button>
                            </Grid>

                        </Grid>
                    </Box>
                </MuiCard>
            </SignInContainer>

        </div>
    )
}

export { LoginPage }
