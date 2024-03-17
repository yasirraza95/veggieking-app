import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
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
import GeneralService from '../services/general.service'

const initialState = {
    inputValues: {
        phone: '',
    },
    inputValidities: {
        phone: false,
    },
}

const ForgotPassword = ({ navigation }) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isEnable, setIsEnable] = useState(true)
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
        try {
            setIsLoading(true);
            setIsEnable(false);
            await GeneralService.forgot(values);
            setIsLoading(false);
            setIsEnable(true);
        } catch (err) {
            if (err?.response?.status == 404) {
                Alert.alert("Error", "No user found");
            } else {
                Alert.alert("Error", "Server error. Please try again later.");
            }
            setIsLoading(false);
            setIsEnable(true);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <StatusBar hidden={true} style="light" />
            <View style={commonStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={commonStyles.backIcon}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={commonStyles.headerTitle}>Forgot Password</Text>
                <Text style={commonStyles.subHeaderTitle}>Please provide your phone number</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={commonStyles.footer}>
                <Formik
                    initialValues={{ phone: '' }}
                    enableReinitialize={true}
                    validationSchema={forgotSchema}
                    onSubmit={handleForgot}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <>
                            <Text style={commonStyles.inputHeader}>Phone No.</Text>
                            <Input
                                name="phone"
                                id="phone"
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                placeholder="03001234567"
                                placeholderTextColor={COLORS.black}
                                keyboardType="numeric"
                            />
                            {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
                            <Button
                                title="Send Code"
                                isEnable={isEnable}
                                isLoading={isLoading}
                                filled
                                onPress={handleSubmit}
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