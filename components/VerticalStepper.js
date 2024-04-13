import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from '../constants';

export default function VerticalStepper({ status }) {
  let packingColor = (status == "PACKING" || status == "TRANSIT" || status == "DELIVERED") ? COLORS.primary : COLORS.gray4;
  let transitColor = (status == "TRANSIT" || status == "DELIVERED") ? COLORS.primary : COLORS.gray4;
  let deliveredColor = (status == "DELIVERED") ? COLORS.primary : COLORS.gray4;
  // let packingColor = COLORS.primary;
  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, { backgroundColor: COLORS.primary }]} />
        <Text style={styles.stepText}>Your order has been received</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, { backgroundColor: packingColor }]} />
        <Text style={styles.stepText}>The order is being packed</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, { backgroundColor: transitColor }]} />
        <Text style={styles.stepText}>Your order has been picked up for delivery</Text>
      </View>

      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, { backgroundColor: deliveredColor }]} />
        <Text style={styles.stepText}>Delivered!</Text>
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
