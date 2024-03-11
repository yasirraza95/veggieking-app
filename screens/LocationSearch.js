import React, { useState } from 'react';
import { View, Text, Image, TextInput, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SIZES, images } from '../constants';

const LocationSearch = () => {
const [currentStep, setCurrentStep] = useState(1);
const [selectedCity, setSelectedCity] = useState('');
const [searchText, setSearchText] = useState('');
const [selectedArea, setSelectedArea] = useState('');

const cityNames = ['Sargodha', 'Lahore', 'Sialkot'];

const handleCityPress = (city) => {
// Handle button press (e.g., navigate or perform an action)
console.log(`Selected City: ${city}`);
};
const handleAreaPress = (area) => {
// Handle button press (e.g., navigate or perform an action)
console.log(`Selected City: ${area}`);
};

const cityData = [
{ name: 'Islamabad', image: require('../assets/images/islamabad_background.webp') },
{ name: 'Lahore', image: require('../assets/images/badshahi-mosque.webp') },
{ name: 'Sialkot', image: require('../assets/images/sialkot_background.webp') },
{ name: 'Karachi', image: require('../assets/images/karachi_background.webp') },
];
const areaData = [
{ name: 'Test1 Area 123 Streat', image: require('../assets/images/white_background.jpg') },
{ name: 'Test2 Area 456 Streat', image: require('../assets/images/white_background.jpg') },
{ name: 'Test3 Area 789 Streat', image: require('../assets/images/white_background.jpg') },
{ name: 'Test4 Area 101 Streat', image: require('../assets/images/white_background.jpg') },
];

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
      <TextInput style={styles.input} placeholder="Enter city" value={selectedCity} onChangeText={(text)=>
        setSelectedCity(text)}
        />
        <View style={styles.buttonGroup}>
          {cityData.map((city, index) => (
          <TouchableOpacity key={index} style={styles.cityButton} onPress={()=> handleCityPress(city)}
            >
            <ImageBackground source={city.image} style={styles.imageBackground} imageStyle={styles.imageStyle}>
              <Text style={styles.cityButtonText}>{city.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
          ))}
        </View>
    </View>
    )}

    {/* Step 2: Select Area */}
    {currentStep === 2 && (
    <View style={styles.stepContent}>
      <Text style={styles.stepText}>Select Area</Text>
      <TextInput style={styles.areaInput} placeholder="Search for an area" value={searchText} onChangeText={(text)=>
        setSearchText(text)}
        />
        {/* Add suggestions or other area selection UI */}
        <View style={styles.buttonGroup}>
          {areaData.map((area, index) => (
          <TouchableOpacity key={index} style={styles.cityButton} onPress={()=> handleAreaPress(area)}
            >
            <ImageBackground source={area.image} style={styles.imageBackground} imageStyle={styles.imageStyle}>
              <Text style={styles.areaButtonText}>{area.name}</Text>
            </ImageBackground>

          </TouchableOpacity>
          ))}
        </View>
    </View>
    )}

    {/* Step 3: Success */}
    {currentStep === 3 && (
    <View style={styles.stepContent}>
      {/*
      <Ionicons name="checkmark-circle" size={100} color="green" /> */}

      <Image source={images.success3} resizeMode="contain" style={{
                      width: SIZES.width * 0.8,
                      height: SIZES.height * 0.4,
                    }} />
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
// alignItems: 'center',
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
// alignItems: 'center',
// padding: 20,
padding: 10,
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
areaInput: {
width: '90%', // Adjust the width as needed
borderWidth: 1,
padding: 10,
marginVertical: 10,
borderRadius: 5,
// Add these properties to ensure a fixed width
alignSelf: 'center', // Align the input in the center of the parent container
// textAlign: 'center',
},
successText: {
fontSize: 20,
fontWeight: 'bold',
color: '#00d24e',
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

buttonGroup: {
flexDirection: 'row',
justifyContent: 'space-around',
flexWrap: 'wrap',
marginTop: 20,
},
cityButton: {
width: 150,
height: 150,
borderRadius: 8,
overflow: 'hidden', // Ensure the borderRadius works
borderWidth: 2, // Border width
borderColor: 'transparent', // Border color
marginBottom: 10, // Margin between buttons
},
imageBackground: {
flex: 1,
justifyContent: 'flex-end', // Position text at the bottom
alignItems: 'center',
},
imageStyle: {
borderRadius: 8,
overflow: 'hidden', // Ensure the borderRadius works
},
cityButtonText: {
color: '#000',
fontWeight: 'bold',
fontSize: 16,
padding: 10, // Add padding to the text for better visibility
},
areaButtonText: {
color: '#f44c00',
fontWeight: 'bold',
fontSize: 16,
padding: 10, // Add padding to the text for better visibility
textAlign: 'center',
marginBottom: 40,
},
});

export default LocationSearch;