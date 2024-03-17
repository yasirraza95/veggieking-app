import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native'
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
import GeneralService from '../services/general.service';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreaters } from '../Redux';
import { bindActionCreators } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  inputValues: {
    phone: '',
    password: '',
  },
  inputValidities: {
    phone: false,
    password: false,
  }
}

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const userActions = bindActionCreators(actionCreaters, dispatch);
  const state = useSelector((state) => state.stateVals);
  const { id, userType } = state;

  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isEnable, setIsEnable] = useState(true)
  const [formState, dispatchFormState] = useReducer(reducer, initialState)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  console.log(`id=${id}`);
  useEffect(() => {
    // console.log("calling");
    const checkAuthentication = async () => {
      if (id) {
        navigation.replace('LocationAccess');
      }
    }
    checkAuthentication();
  }, [id, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error)
    }
  }, [error])

  const handleLogin = async (values) => {
    try {
      setIsLoading(true);
      setIsEnable(false);
      const response = await GeneralService.login(values);
      const { data } = response;
      const { access_token, user } = data;
      const { id, user_type } = user;
      // console.log(id);
      // FIXME
      // userActions.logIn({
      //   accessToken: access_token,
      //   id: id,
      //   user_type: user_type,
      // });
      AsyncStorage.setItem("accessToken", access_token);
      AsyncStorage.setItem("_id", id);
      AsyncStorage.setItem("user_type", user_type);
      // const { id, first_name, last_name, username, phone, email } = user;

      // navigation.navigate('LocationAccess');
      setIsLoading(false);
      setIsEnable(true);
    } catch (err) {
      console.log(err)
      if (err?.response?.status == 401) {
        Alert.alert("Error", "You entered wrong phone / password");
      } else {
        Alert.alert("Error", "Server error. Please try again later.");
      }
      setIsLoading(false);
      setIsEnable(true);
    }
  };

  return (

    <View style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar style="light" />
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Log In</Text>
        <Text style={commonStyles.subHeaderTitle}>Please sign in to your existing account</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={commonStyles.footer}
      >
        <Formik
          initialValues={{ phone: '', password: '' }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
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

              <Text style={commonStyles.inputHeader} >Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Input
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  autoCapitalize="none"
                  placeholder="*************"
                  placeholderTextColor={COLORS.black}
                  secureTextEntry={!isPasswordVisible}
                  style={{ flex: 1, marginRight: 10 }}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={{ padding: 0, marginLeft: -40 }}>
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="black" />
                </TouchableOpacity>
                {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
              </View>
              <View
                style={commonStyles.checkBoxContainer}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text
                    style={{ ...FONTS.body4, color: COLORS.primary }}
                  >Forgot Password ?</Text>
                </TouchableOpacity>
              </View>
              <Button
                title="Log In"
                isEnable={isEnable}
                isLoading={isLoading}
                filled
                onPress={handleSubmit}
                style={commonStyles.btn}
              />
            </>
          )}
        </Formik>
        <View style={styles.hr} />
        <TouchableOpacity
          style={styles.googleButton}>
          <Image
            source={icons.google}
            resizeMode="contain"
            style={styles.gogleIcon} />
          <Text
            style={styles.googleText}
          >Login with Google</Text>
        </TouchableOpacity>
        <View
          style={commonStyles.center}>
          <Text
            style={{ ...FONTS.body4, color: COLORS.black }}
          >Don't have an account?{" "}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
          >
            <Text
              style={{ ...FONTS.body4, color: COLORS.primary }}
            >SIGN UP</Text>
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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 10,
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