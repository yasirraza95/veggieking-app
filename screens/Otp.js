import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, illustrations } from '../constants'


const VerificationComponent = ({ route }) => {
  const { email } = route.params;
  const handleBack = () => {
    // Implement your back button logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>OTP Verification</Text>
      </View>
      <View style={styles.content}>
        <Image
          source={illustrations.otpVerify}
          resizeMode="contain"
          style={styles.locationImage}
        />
        <Text style={styles.subHeaderText}>We've sent a verification code to</Text>
        <Text style={styles.phoneNumber}>{email}</Text>
        <View style={styles.inputContainer}>
          <TextInput keyboardType='numeric' style={styles.input} value="5" />
          <TextInput keyboardType='numeric' style={styles.input} value="2" />
          <TextInput keyboardType='numeric' style={styles.input} value="7" />
          <TextInput keyboardType='numeric' style={styles.input} value="4" />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Resend Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Confirm</Text>
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity>
          <Text style={styles.otherMethods}>Try other login methods</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44c00',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationImage: {
    height: SIZES.width * 0.8,
    width: SIZES.width * 0.9,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#495057',
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: screenWidth * 0.8,
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: screenWidth * 0.8,
  },
  button: {
    flex: 1,
    backgroundColor: '#f44c00',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    margin: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
  otherMethods: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerificationComponent;
