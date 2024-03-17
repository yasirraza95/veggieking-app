import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { COLORS } from '../constants'
import * as Animatable from "react-native-animatable"
import Input from '../components/Input'
import Button from '../components/Button'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducers'
import { commonStyles } from '../styles/CommonStyles'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from "@expo/vector-icons"
import { forgotSchema } from '../schema'
import { Formik } from 'formik'

const initialState = {
    inputValues: {
        email: '',
    },
    inputValidities: {
        email: false,
    },
}

const ForgotPassword = ({ navigation }) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)

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


    const handleForgot = async (values) => {
        const SignupSuccess = await handleSubmit(values.email);

        if (SignupSuccess) {
            navigation.navigate('Login');
        } else {
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <StatusBar style="light" />
            <View style={commonStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={commonStyles.backIcon}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>Forgot Password</Text>
                <Text style={commonStyles.subHeaderTitle}>Please provide to your existing email</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={commonStyles.footer}>
                <Formik
                    initialValues={{ email: '' }}
                    enableReinitialize={true}
                    validationSchema={forgotSchema}
                    onSubmit={handleForgot}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
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
                            <Button
                                title="SEND CODE"
                                isLoading={isLoading}
                                filled onPress={handleSubmit}
                                style={commonStyles.btn1}
                            />
                        </>
                    )}
                </Formik>
            </Animatable.View>
        </View>
    )
}
const styles = StyleSheet.create({
    error: {
        color: "red"
    },
});

export default ForgotPassword