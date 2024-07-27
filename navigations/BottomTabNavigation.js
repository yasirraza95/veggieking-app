import { View, Text, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../constants'
import { HomeV1, Profile, Search, Card, Notifications, Menu, MyOrders, Message, PersonalProfile, Cart, Login } from '../screens'
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import DrawerNavigation from './DrawerNavigation'
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/core'
import { useCart } from '../context/CartContext';
var userId;
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

    const checkAuthentication = async () => {
        userId = await AsyncStorage.getItem("_id");
    }

    useEffect(() => {
        checkAuthentication();
    }, []);

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

            {userId && (
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
            )}

            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
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
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Profile"
                component={userId ? PersonalProfile : Login}
                // component={Login}
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
    cartBadgeContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        transform: [{ translateX: 6 }, { translateY: -8 }],
    },
    cartBadge: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
    },
});

export default BottomTabNavigation