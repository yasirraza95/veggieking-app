import { View, Text, Platform, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants';
import { HomeV1, Profile, MyOrders, PersonalProfile, Cart, Login } from '../screens';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import DrawerNavigation from './DrawerNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

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
        backgroundColor: '#f44c00', // Updated background color
        borderTopLeftRadius: 20, // Apply border radius
        borderTopRightRadius: 20, // Apply border radius
        overflow: 'hidden', // Ensure the border radius is effective
    },
};

const BottomTabNavigation = () => {
    const { cartCounter } = useCart();
    const [userId, setUserId] = useState(null); // State to hold userId

    const checkAuthentication = async () => {
        const id = await AsyncStorage.getItem("_id");
        setUserId(id); // Set the userId in state
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Home"
                component={DrawerNavigation}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <SimpleLineIcons 
                            name="home" 
                            size={24} 
                            color="white" // Icon color set to white
                        />
                    ),
                }}
            />

            {userId && ( // Conditional rendering for MyOrders screen based on userId
                <Tab.Screen
                    name="MyOrders"
                    component={MyOrders}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons
                                name="gift-outline"
                                size={24}
                                color="white" // Icon color set to white
                            />
                        ),
                    }}
                />
            )}

            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                            <Ionicons
                                name={focused ? "cart-sharp" : "cart-outline"}
                                size={24}
                                color="white" // Icon color set to white
                            />
                            {cartCounter > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartCounter}</Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={userId ? PersonalProfile : Login}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color="white" // Icon color set to white
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    cartBadge: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        position: 'absolute',
        top: 0,
        right: 0,
        transform: [{ translateX: 6 }, { translateY: -8 }],
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
    },
});

export default BottomTabNavigation;
