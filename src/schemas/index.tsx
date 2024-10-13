import * as Yup from 'yup';

export const authValidationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    user_name: Yup.string()
        .matches(/^[a-zA-Z][a-zA-Z0-9._]{0,29}$/, 'Username must start with a letter and can contain letters, numbers, underscores, and periods (1-30 characters).')
        .required('Username is required'),
    first_name: Yup.string()
        .max(15, 'First name must be 15 characters or less')
        .required('First name is required'),
    last_name: Yup.string()
        .max(20, 'Last name must be 20 characters or less')
        .required('Last name is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
        confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required('Please confirm your password')
});
