import { View, Text, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../constants'
import { HomeV1, Profile, Search, Card, Notifications, Menu, MyOrders, Message, PersonalProfile, Cart } from '../screens'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import DrawerNavigation from './DrawerNavigation'
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/core'
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator()

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: Platform.OS === 'ios' ? 90 : 60,
        background: COLORS.white,
    },
}

const BottomTabNavigation = () => {
    const { cartCounter } = useCart();

    // useFocusEffect(
    //     React.useCallback(() => {
    //         getCartCounter();
    //     }, [])
    // );

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Home"
                component={DrawerNavigation}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <SimpleLineIcons name="home" size={24} color={
                                focused
                                    ? COLORS.primary
                                    : COLORS.black
                            } />
                        )
                    },
                }}
            />

            <Tab.Screen
                name="MyOrders"
                component={MyOrders}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name="gift-outline"
                                size={24}
                                color={
                                    focused
                                        ? COLORS.primary
                                        : COLORS.black
                                }
                            />
                        )
                    },
                }}
            />

            {/* <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: () => {
                        return (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: COLORS.primary,
                                    height: Platform.OS == 'ios' ? 70 : 60,
                                    width: Platform.OS == 'ios' ? 70 : 60,
                                    top: Platform.OS == 'ios' ? -20 : -30,
                                    borderRadius:
                                        Platform.OS == 'ios' ? 35 : 30,
                                    borderWidth: 2,
                                    borderColor: COLORS.white,
                                }}
                            >
                                <Ionicons name="search-outline" size={24} color={COLORS.white} />
                            </View>
                        )
                    },
                }}
            /> */}

            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <>
                                <Ionicons
                                    name={focused ? "cart-sharp" : "cart-outline"}
                                    size={24}
                                    color={
                                        focused ? COLORS.primary : COLORS.black
                                    }
                                />
                                {cartCounter > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{cartCounter}</Text>
                                    </View>
                                )}
                            </>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Profile"
                component={PersonalProfile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name="person-outline"
                                size={24}
                                color={
                                    focused ? COLORS.primary : COLORS.black
                                }
                            />
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    cartBadge: {
        position: 'absolute',
        bottom: 25,
        right: 15,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
    },
});

export default BottomTabNavigation