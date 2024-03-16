import { View, Text, TouchableOpacity , StyleSheet} from 'react-native'
import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { COLORS } from '../constants'
import * as Animatable from "react-native-animatable"
import Input from '../components/Input'
import Button from '../components/Button'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducers'
import { commonStyles } from '../styles/CommonStyles'
import { StatusBar } from 'expo-status-bar'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik'
import { signInSchema } from '../schema'
import { Ionicons } from '@expo/vector-icons';

const isTestMode = true

const initialState = {
    inputValues: {
        fullName: isTestMode ? 'John Doe' : '',
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
        confirmPassword: isTestMode ? '**********' : ''
    },
    inputValidities: {
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false
    },
    formIsValid: false,
}

const Signup = ({ navigation }) => {
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

    const handleSignUp = async (values) => {
        // Assuming your login logic returns a boolean indicating success
        const SignupSuccess = await handleSubmit(values.fullName,values.email, values.password, values.passwordConfirm);
        
        if (SignupSuccess) {
          // Navigate to the next screen
          navigation.navigate('Login');
        } else {
          // Handle login failure, maybe show an error message
        }
      };
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <StatusBar hidden={true} />
            <View style={commonStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={commonStyles.backIcon}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>Sign up</Text>
                <Text
                    style={commonStyles.subHeaderTitle}>Please sign up to get started</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={commonStyles.footer}>
                < KeyboardAwareScrollView>
                <Formik
        initialValues={{ fullName: '', email: '', password: '', passwordConfirm: '' }}
        validationSchema={signInSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
                    <Text style={commonStyles.inputHeader}>Name</Text>
                    <Input
                        id="fullName"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['fullName']}
                        placeholder="John Doe"
                        placeholderTextColor={COLORS.black}
                        value={values.fullName}
                    />
            {touched.fullName && errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

                    <Text style={commonStyles.inputHeader}>Email</Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="example@gmail.com"
                        placeholderTextColor={COLORS.black}
                        keyboardType="email-address"
                        value={values.email}

                    />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                    <Text style={commonStyles.inputHeader}>Password</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        autoCapitalize="none"
                        id="password"
                        placeholder="*************"
                        placeholderTextColor={COLORS.black}
                        secureTextEntry={!isPasswordVisible} 
                        value={values.password}

                    />
                      <TouchableOpacity onPress={togglePasswordVisibility} style={{padding: 0, marginLeft: -40}}>
    <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline' } size={24} color="black" />
  </TouchableOpacity>
{touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            </View>        
                      <Text style={commonStyles.inputHeader}>Re-Type Password</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['passwordConfirm']}
                        autoCapitalize="none"
                        id="passwordConfirm"
                        placeholder="*************"
                        placeholderTextColor={COLORS.black}
                        value={values.passwordConfirm}
                        secureTextEntry={!isPasswordVisible} 

                    />
                      <TouchableOpacity onPress={togglePasswordVisibility} style={{padding: 0, marginLeft: -40}}>
    <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline' } size={24} color="black" />
  </TouchableOpacity>
{touched.passwordConfirm && errors.passwordConfirm && <Text style={styles.error}>{errors.passwordConfirm}</Text>}
</View>
                    <Button
                        title="SIGN UP"
                        isLoading={isLoading}
                        filled onPress={handleSubmit}
                        // filled
                        // onPress={() => navigation.navigate('Login')}
                        style={commonStyles.btn1}
                    />
                    
                    </>
        )}
      </Formik>
                </KeyboardAwareScrollView>
            </Animatable.View>
        </View>
    )
}
const styles = StyleSheet.create({
    error: {
        color: "red"
    },
});

export default Signup