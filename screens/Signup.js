import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import GeneralService from '../services/general.service'


const initialState = {
    inputValues: {
        name: '',
        phone: '',
        email: '',
        password: '',
    },
    inputValidities: {
        name: false,
        phone: false,
        email: false,
        password: false,
    },
}

const Signup = ({ navigation }) => {
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isEnable, setIsEnable] = useState(true)
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
        try {
            setIsLoading(true);
            setIsEnable(false);
            await GeneralService.register(values);
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
        <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
            <StatusBar hidden={true} style="light" />
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
                    <Formik
                        initialValues={{ name: '', phone: '', email: '', password: '', }}
                        validationSchema={signInSchema}
                        enableReinitialize={true}
                        onSubmit={handleSignUp}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <>
                                <Text style={commonStyles.inputHeader}>Name</Text>
                                <Input
                                    name="name"
                                    id="name"
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    placeholder="Full Name"
                                    placeholderTextColor={COLORS.black}
                                />
                                {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                                <Text style={commonStyles.inputHeader}>Phone No.</Text>
                                <Input
                                    name="phone"
                                    id="phone"
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    value={values.phone}
                                    placeholder="Phone No."
                                    placeholderTextColor={COLORS.black}
                                    keyboardType="numeric"

                                />
                                {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                                <Text style={commonStyles.inputHeader}>Email Address</Text>
                                <Input
                                    name="email"
                                    id="email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    placeholder="Email Address"
                                    placeholderTextColor={COLORS.black}
                                    keyboardType="email-address"
                                />
                                {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                                <Text style={commonStyles.inputHeader}>Password</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Input
                                        name="password"
                                        id="password"
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        autoCapitalize="none"
                                        placeholder="*************"
                                        placeholderTextColor={COLORS.black}
                                        secureTextEntry={!isPasswordVisible}

                                    />
                                    <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 0, marginLeft: -40 }}>
                                        <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                    {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                                <Button
                                    title="Sign Up"
                                    isLoading={isLoading}
                                    filled onPress={handleSubmit}
                                    isEnable={isEnable}
                                    // filled
                                    // onPress={() => navigation.navigate('Login')}
                                    style={commonStyles.btn1}
                                />
                            </>
                        )}
                    </Formik>
            </Animatable.View>
        </View>
        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    error: {
        color: "red"
    },
});

export default Signup