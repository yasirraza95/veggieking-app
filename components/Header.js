import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { COLORS, icons } from '../constants'

const Header = ({ title }) => {
    const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
    <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerIcon}>
        <Image
            source={icons.arrowLeft}
            resizeMode='contain'
            style={styles.arrowLeft}
        />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity style={styles.headerIcon}>
        <Image
            source={icons.more}
            resizeMode='contain'
            style={styles.moreIcon}
        />
    </TouchableOpacity>
</View>
  )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 12,
        alignItems: "center"
    },
    headerIcon: {
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        backgroundColor: COLORS.gray
    },
    arrowLeft: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    moreIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    title: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.black
    }
})

export default Header