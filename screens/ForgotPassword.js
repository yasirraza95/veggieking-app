import { View, Text, TouchableOpacity } from 'react-native'
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

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
    },
    inputValidities: {
        email: false,
    },
    formIsValid: false,
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
                <Text style={commonStyles.inputHeader}>Email</Text>
                <Input
                    id="email"
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities['email']}
                    placeholder="example@gmail.com"
                    placeholderTextColor={COLORS.black}
                    keyboardType="email-address"
                />
                <Button
                    title="SEND CODE"
                    isLoading={isLoading}
                    filled
                    onPress={() => navigation.navigate('Verification')}
                    style={commonStyles.btn1}
                />
            </Animatable.View>
        </View>
    )
}

export default ForgotPassword