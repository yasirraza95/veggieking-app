import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LocationSearch = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Handle finishing the location selection process (e.g., navigate to success screen)
    console.log('Selected City:', selectedCity);
    console.log('Selected Area:', selectedArea);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        <Text style={styles.headerText}>Location Selection</Text>
      </View>

      {/* Step Content */}
      <View style={styles.stepContainer}>
        {/* Step 1: Select City */}
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepText}>Select City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              value={selectedCity}
              onChangeText={(text) => setSelectedCity(text)}
            />
          </View>
        )}

        {/* Step 2: Select Area */}
        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepText}>Select Area</Text>
            <TextInput
              style={styles.input}
              placeholder="Search for an area"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
            {/* Add suggestions or other area selection UI */}
          </View>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Ionicons name="checkmark-circle" size={100} color="green" />
            <Text style={styles.successText}>Success!</Text>
          </View>
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep === 3 ? (
          <TouchableOpacity style={styles.button} onPress={handleFinish}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#f44c00',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  stepContent: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '90%', // Adjust the width as needed
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f44c00',
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationSearch;
