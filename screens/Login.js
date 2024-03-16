import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants'
import Checkbox from 'expo-checkbox'
import * as Animatable from "react-native-animatable"
import Input from '../components/Input'
import Button from '../components/Button'
import icons from '../constants/icons'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducers'
import { commonStyles } from '../styles/CommonStyles'
import { StatusBar } from 'expo-status-bar'
import { validationSchema } from '../schema';
import { Formik } from 'formik';

const isTestMode = true

const initialState = {
inputValues: {
email: isTestMode ? 'example@gmail.com' : '',
password: isTestMode ? '**********' : '',
},
inputValidities: {
email: false,
password: false,
},
formIsValid: false,
}

const Login = ({ navigation }) => {
const [isChecked, setChecked] = useState(false);
const [error, setError] = useState()
const [isLoading, setIsLoading] = useState(false)
const [formState, dispatchFormState] = useReducer(reducer, initialState)

const [isPasswordVisible, setIsPasswordVisible] = useState(false);

const togglePasswordVisibility = () => {
setIsPasswordVisible(!isPasswordVisible);
};

const inputChangedHandler = useCallback(
(inputId, inputValue) => {
const result = validateInput(inputId, inputValue)
dispatchFormState({ inputId, validationResult: result, inputValue })
},
[dispatchFormState]
)

useEffect(() => {
if (error) {
Alert.alert('An error occured', error)
}
}, [error])

// implementing facebook authentication
const facebookAuthHandler = () => {
return null
}

// implementing twitter authentication
const twitterAuthHandler = () => {
return null
}

// implementing apple authentication
const appleAuthHandler = () => {
return null
}
const handleLogin = async (values) => {
// Assuming your login logic returns a boolean indicating success
const loginSuccess = await handleSubmit(values.email, values.password);

if (loginSuccess) {
// Navigate to the next screen
navigation.navigate('LocationAccess');
} else {
// Handle login failure, maybe show an error message
}
};

return (
<View style={{ flex: 1, backgroundColor: COLORS.primary }}>
  <StatusBar style="light" />
  <View style={commonStyles.header}>
    <Text style={commonStyles.headerTitle}>Log In</Text>

    <Text style={commonStyles.subHeaderTitle}>Please sign in to your existing account</Text>
  </View>
  <Animatable.View animation="fadeInUpBig" style={commonStyles.footer}>
    <Formik initialValues={{ email: '', password: '' }} validationSchema={validationSchema} onSubmit={handleLogin}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
      <>
        <Text style={commonStyles.inputHeader}>Email</Text>
        <Input id="email" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email}
          placeholder="example@gmail.com" placeholderTextColor={COLORS.black} keyboardType="email-address" />
        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Text style={commonStyles.inputHeader}>Password</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* <Input onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password}
          autoCapitalize="none" id="password" placeholder="*************" placeholderTextColor={COLORS.black}
          secureTextEntry={true} /> */}
        <Input onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password}
          autoCapitalize="none" placeholder="*************" placeholderTextColor={COLORS.black}
          secureTextEntry={!isPasswordVisible} 
          style={{ flex: 1, marginRight: 10 }}
          />
        <TouchableOpacity onPress={togglePasswordVisibility} style={{padding: 0, marginLeft: -40}}>
    <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline' } size={24} color="black" />
  </TouchableOpacity>
        {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
        </View>
        <View style={commonStyles.checkBoxContainer}>
          {/* Checkbox and Forgot Password */}
          <TouchableOpacity onPress={()=> navigation.navigate("ForgotPassword")}
            >
            <Text style={{ ...FONTS.body4, color: COLORS.primary }}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        <Button title="Log In" isLoading={isLoading} filled onPress={handleSubmit} style={commonStyles.btn} />
      </>
      )}
    </Formik>
    <View style={styles.hr} />

    <TouchableOpacity style={styles.googleButton}>
      <Image source={icons.google} resizeMode="contain" style={styles.gogleIcon} />
      <Text style={styles.googleText}>Login with Google</Text>
    </TouchableOpacity>
    <View style={commonStyles.center}>
      <Text style={{ ...FONTS.body4, color: COLORS.black }}>Don't have an account?{" "}</Text>
      <TouchableOpacity onPress={()=> navigation.navigate("Signup")}
        >
        <Text style={{ ...FONTS.body4, color: COLORS.primary }}>SIGN UP</Text>
      </TouchableOpacity>
    </View>
  </Animatable.View>
</View>
)
}

const styles = StyleSheet.create({
error: {
color: "red"
},
gogleIcon: {
height: 25,
width: 25,
marginRight: 5,
},
googleButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
backgroundColor: '#fff',
borderWidth: 2,
borderColor: "#DB4437",
paddingHorizontal: 15,
paddingVertical: 10,
borderRadius: 10,
elevation: 3,
marginBottom: 20,
marginTop: 30,
},
hr: {
borderBottomColor: '#ccc', // Change the color as needed
borderBottomWidth: 1,
marginVertical: 10, // Adjust the vertical margin as needed
},
googleIcon: {
marginRight: 10,
},
googleText: {
color: '#DB4437',
fontWeight: 'bold',
fontSize: 16,
},
});

export default Login