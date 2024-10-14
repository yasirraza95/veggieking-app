import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { COLORS, SIZES, icons, images } from "../constants"
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { commonStyles } from '../styles/CommonStyles'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { launchImagePicker } from '../utils/imagePickerHelper'
import Input from '../components/Input'
import Button from '../components/Button'
import { validateInput } from '../utils/actions/formActions'
import { reducer } from '../utils/reducers/formReducers'
import { ScrollView } from 'react-native-virtualized-view'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { signInSchema, userProfile } from '../schema'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GeneralService from '../services/general.service'
import { useCart } from '../context/CartContext';

const EditProfile = () => {
    const { updateUserAddress } = useCart();
    const [image, setImage] = useState(null);
    const [error, setError] = useState();
    const [profileInfo, setProfileInfo] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEnable, setIsEnable] = useState(true);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [formState, dispatchFormState] = useReducer(reducer, initialState)

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const getUserById = async () => {
        try {
            let userId = await AsyncStorage.getItem("_id");
            const timeout = 8000;
            const response = await Promise.race([
                GeneralService.getUserById(userId),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
            ]);

            if (response) {
                setProfileInfo({
                    name: response.data.response.first_name + " " + response.data.response.last_name,
                    address: response.data.response.address,
                    phone: response.data.response.phone,
                    email: response.data.response.email,
                });
            } else {
                throw new Error('No response from the server');
            }
        } catch (err) {
            // console.log(err);
            Alert.alert("Error", "No response from server");
        }
    }

    const initialState = {
        inputValues: {
            name: profileInfo.name,
            email: profileInfo.email,
            phone: profileInfo.phone,
            address: profileInfo.address
        },
        inputValidities: {
            name: false,
            email: false,
            phone: false,
            address: profileInfo.address
        },
        formIsValid: false,
    }

    // useEffect(() => {
    //     getUserById();
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            getUserById();
        }, [])
    );

    const updateProfile = async (values) => {
        console.log(values);
        try {
            let userId = await AsyncStorage.getItem("_id");

            setIsLoading(true);
            setIsEnable(false);
            // console.log(values);
            const timeout = 8000;
            const response = await Promise.race([
                GeneralService.updateUserById(values.name, values.address, values.phone, values.email, userId),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
            ]);

            if (response) {
                await AsyncStorage.setItem("my_address", values.address);
                updateUserAddress(values.address);
                getUserById();
                Alert.alert('Success', 'Information updated successfully');
            } else {
                throw new Error('No response from the server');
            }
            // const response = await GeneralService.updateUserById(values.name, values.address, values.phone, values.email, userId);
            // console.log('SignUp response:', response);
            setIsLoading(false);
            setIsEnable(true);
            // Alert.alert('Success', 'User registered successfully');
        } catch (err) {
            // console.log(err);
            setIsLoading(false);
            setIsEnable(true);
            setEmailError("");
            setPhoneError("");
            if (err?.response?.status === 422) {
                // console.log(err?.response?.data);
                if (err?.response?.data?.email) {
                    setEmailError(err?.response?.data?.email[0]);
                }

                if (err?.response?.data?.phone) {
                    setPhoneError(err?.response?.data?.phone[0]);
                }
            } else {
                Alert.alert("Error", "Server error. Please try again later.");
            }
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error])

    const pickImage = async () => {
        try {
            const tempUri = await launchImagePicker()

            if (!tempUri) return

            // set the image
            setImage({ uri: tempUri })
        } catch (error) { }
    }

    const renderHeader = () => {
        const navigation = useNavigation()
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={commonStyles.header1Icon}
                    >
                        <Image
                            resizeMode='contain'
                            source={icons.arrowLeft}
                            style={{ height: 24, width: 24, tintColor: COLORS.black }}
                        />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 12, fontSize: 17, fontFamily: 'regular' }}>Edit Profile</Text>
                </View>

            </View>
        )
    }

    const renderEditProfileForm = () => {
        const navigation = useNavigation()
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {/* <View style={{ marginVertical: 12 }}>
                    <Image
                        source={
                            image === null ?
                                images.avatar2 :
                                image
                        }
                        resizeMode='contain'
                        style={{
                            height: 130,
                            width: 130,
                            borderRadius: 65
                        }}
                    />
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            height: 42,
                            width: 42,
                            borderRadius: 21,
                            backgroundColor: COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'absolute',
                            bottom: 0,
                            right: 0
                        }}
                    >
                        <MaterialCommunityIcons
                            name="pencil-outline"
                            size={24}
                            color={COLORS.white} />
                    </TouchableOpacity>
                </View> */}
                <Formik
                    initialValues={initialState.inputValues}
                    validationSchema={userProfile}
                    enableReinitialize={true}
                    onSubmit={updateProfile}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={{
                            width: SIZES.width - 32, marginVertical: 25
                        }}>
                            <Text style={commonStyles.inputHeader}>Name</Text>
                            <Input
                                id="name"
                                name="name"
                                autoCapitalize="words"
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                // onInputChanged={inputChangedHandler}
                                // errorText={formState.inputValidities['name']}
                                placeholder="Full Name"
                                placeholderTextColor={COLORS.black}
                            />
                            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                            <Text style={commonStyles.inputHeader}>Address</Text>
                            <Input
                                id="address"
                                name="address"
                                onChangeText={handleChange('address')}
                                onBlur={handleBlur('address')}
                                // onInputChanged={inputChangedHandler}
                                // errorText={formState.inputValidities['email']}
                                value={values.address}
                                placeholder="Address"
                                placeholderTextColor={COLORS.black}
                            />
                            {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

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
                            {!phoneError && touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
                            {!errors.phone && phoneError && <Text style={styles.error}>{phoneError}</Text>}

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
                            {!emailError && touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                            {!errors.email && emailError && <Text style={styles.error}>{emailError}</Text>}


                            {/* <Button
                                title="SAVE"
                                filled
                                onPress={() => navigation.navigate("PersonalProfile")}
                                style={{
                                    marginTop: 12
                                }}
                            /> */}

                            <Button
                                title="Update"
                                isLoading={isLoading}
                                filled onPress={handleSubmit}
                                isEnable={isEnable}
                                style={commonStyles.btn1}
                            />
                        </View>
                    )}
                </Formik>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: COLORS.white }}>
            <StatusBar hidden={true} />
            <View style={{
                flex: 1,
                marginHorizontal: 16
            }}>
                {renderHeader()}
                <ScrollView>
                    {renderEditProfileForm()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    error: {
        color: "red"
    },
});

export default EditProfile