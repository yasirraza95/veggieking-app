import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants';

export default function VerticalStepper() {
  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, {  backgroundColor: COLORS.primary }]} />
        <Text style={styles.stepText}>Your order has been received</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, {  backgroundColor: COLORS.primary }]} />
        <Text style={styles.stepText}>The restaurant is preparing your food</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, {  backgroundColor: COLORS.primary }]}/>
        <Text style={styles.stepText}>Your order has been picked up for delivery</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, {  backgroundColor: COLORS.gray4}]} />
        <Text style={styles.stepText}>Order arriving soon!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  stepText: {
    fontSize: 13,
    color: COLORS.black,
    fontFamily: 'regular'
  },
});
