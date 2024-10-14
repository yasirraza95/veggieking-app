import { View, Input, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-virtualized-view'
import { COLORS, SIZES, FONTS, icons, images } from "../constants"
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { commonStyles } from '../styles/CommonStyles'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { useDispatch, useSelector } from "react-redux";
import { actionCreaters, bindActionCreators } from '../Redux';
import GeneralService from '../services/general.service'
import { ProfileSchema } from '../schema/index';
import AsyncStorage from '@react-native-async-storage/async-storage'
// import Input from '../components/Input'

const PersonalProfile = () => {
  // const dispatch = useDispatch();
  // const userActions = bindActionCreators(actionCreaters, dispatch);
  // const state = useSelector((state) => state.stateVals);

  // const { id, accessToken } = state;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const getProfile = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      const response = await GeneralService.getUserById(userId);
      setName(response.data.response.first_name + " " + response.data.response.last_name);
      setEmail(response.data.response.email);
      setPhone(response.data.response.phone);
      setAddress(response.data.response.address);

    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   getProfile();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
    }, [])
  );

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
          <Text style={{ marginLeft: 12, fontSize: 17, fontFamily: 'regular' }}>Personal Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={{
            fontSize: 14,
            textTransform: 'uppercase',
            color: COLORS.primary,
            fontFamily: 'bold'
          }}>Edit</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderUserProfile = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
        <Image
          source={images.avatar2}
          resizeMode='contain'
          style={{
            height: 100,
            width: 100,
            borderRadius: 50
          }}
        />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ ...FONTS.h4 }}>Vishal Khadok</Text>
          <Text style={{
            fontSize: 12,
            fontFamily: 'regular',
            color: COLORS.gray5,
            marginVertical: 6
          }}>I love fast food</Text>
        </View>
      </View>
    )
  }

  const renderUserProfileInfo = () => {
    return (
      // <Formik
      //   initialValues={{
      //     fullName: name || '',
      //     email: email || '',
      //     phone: phone || '',
      //   }}
      //   onSubmit={(values) => {
      //     // Handle form submission
      //   }}
      //   ProfileSchema={ProfileSchema} // Define your validation schema here
      // >
      //   {(formikProps) => (
      //     <View style={{ flexDirection: 'column' }}>
      //       <View style={styles.container}>
      //         <TouchableOpacity
      //           style={styles.subContainer}
      //         >
      //           {/* Formik field for Full Name */}
      //           <View style={styles.subLeftContainer}>
      //             <View style={styles.rounded}>
      //               <Feather name="user" size={24} color={COLORS.primary} />
      //             </View>
      //             <View style={{ flexDirection: 'column' }}>
      //               <Text style={styles.boldBody}>Full Name</Text>
      //               <Input
      //                 style={styles.textBody}
      //                 onChangeText={formikProps.handleChange('fullName')}
      //                 onBlur={formikProps.handleBlur('fullName')}
      //                 value={formikProps.values.fullName}
      //               />
      //               <Text style={styles.errorText}>{formikProps.touched.fullName && formikProps.errors.fullName}</Text>
      //             </View>
      //             <View style={{ flexDirection: 'column' }}>
      //               <Text style={styles.boldBody}>Email</Text>
      //               <Input
      //                 style={styles.textBody}
      //                 onChangeText={formikProps.handleChange('email')}
      //                 onBlur={formikProps.handleBlur('email')}
      //                 value={formikProps.values.email}
      //               />
      //               <Text style={styles.errorText}>{formikProps.touched.email && formikProps.errors.email}</Text>
      //             </View>
      //             <View style={{ flexDirection: 'column' }}>
      //               <Text style={styles.boldBody}>Phone No</Text>
      //               <Input
      //                 style={styles.textBody}
      //                 onChangeText={formikProps.handleChange('phone')}
      //                 onBlur={formikProps.handleBlur('phone')}
      //                 value={formikProps.values.phone}
      //               />
      //               <Text style={styles.errorText}>{formikProps.touched.phone && formikProps.errors.phone}</Text>
      //             </View>
      //           </View>
      //         </TouchableOpacity>
      //         {/* Repeat similar pattern for other form fields */}
      //       </View>
      //     </View>
      //   )}
      // </Formik>
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.subContainer}
          >
            <View style={styles.subLeftContainer}>
              <View style={styles.rounded}>
                <Feather name="user" size={24} color={COLORS.primary} />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.boldBody}>Full Name</Text>
                <Text style={styles.textBody}>{name}</Text>
              </View>
            </View>

          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subContainer}
          >
            <View style={styles.subLeftContainer}>
              <View style={styles.rounded}>
                <MaterialCommunityIcons name="email-outline" size={24} color="#413DFB" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.boldBody}>Email</Text>
                <Text style={styles.textBody}>{email}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subContainer}
          >
            <View style={styles.subLeftContainer}>
              <View style={styles.rounded}>
                <Feather name="phone" size={24} color="#369BFF" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.boldBody}>Phone Number</Text>
                <Text style={styles.textBody}>{phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subContainer}
          >
            <View style={styles.subLeftContainer}>
              <View style={styles.rounded}>
                <Feather name="map-pin" size={24} color="#369BFF" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.boldBody}>Address</Text>
                <Text style={styles.textBody}>{address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


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
          {/* {renderUserProfile()} */}
          {renderUserProfileInfo()}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: SIZES.width - 32,
    paddingVertical: 8,
    marginBottom: 12
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginVertical: 8
  },
  subLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rounded: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12
  },
  textBody: {
    fontSize: 12,
    fontFamily: 'regular',
    color: "#32343E"
  },
  iconRight: {
    height: 16,
    width: 16,
    marginRight: 8,
    tintColor: "#747783"
  },
  boldBody: {
    fontSize: 13,
    fontFamily: 'regular',
    color: COLORS.black,
    textTransform: 'uppercase',
    marginVertical: 6
  }
})

export default PersonalProfile