// validationSchema.js
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});


export const signInSchema = Yup.object({
  fullName: Yup.string().min(2).max(10).required("Please enter the Name"),
  email: Yup.string().min(2).required("Please enter the Email"),
  password: Yup.string().min(2).required("Please enter the Password"),
  passwordConfirm: Yup.string()
  .required("Please enter the password again")
  .oneOf([Yup.ref('password'),null],"Password must match")
});
export const forgotSchema = Yup.object({
  email: Yup.string().min(2).required("Please enter the Email"),
});