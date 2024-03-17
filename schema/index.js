import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  phone: Yup.string().min(11).max(11).required("Enter Phone No."),
  password: Yup.string().required('Enter Password'),
});

export const signInSchema = Yup.object({
  name: Yup.string().min(2, "Min 5 characters").max(50, "Max 50 characters").required("Enter Full Name"),
  phone: Yup.string().min(11, "Min 11 numbers").max(11, "Max 11 numbers").matches(
    /^03[0-9]{9}$/, 'Invalid phone number'
  ).required("Enter Phone No."),
  email: Yup.string().email('Enter valid email').required("Please enter the Email"),
  // password: Yup.string().min(2).required("Enter Password"),
  password: Yup.string().min(4, 'Min 4 characters').required('Enter Password')
});

export const forgotSchema = Yup.object({
  phone: Yup.string().min(11).max(11).required("Enter Phone No."),
});