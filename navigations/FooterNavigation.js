import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';
import { useCart } from '../context/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen, MyOrders, Cart, Profile, Login, PersonalProfile } from '../screens'; // Adjust imports as needed

const FooterNavigation = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { cartCounter } = useCart();
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState('Home');

    useEffect(() => {
        const checkAuthentication = async () => {
            const id = await AsyncStorage.getItem("_id");
            setUserId(id);
        };
        checkAuthentication();
    }, []);

    const handleNavigation = (screen) => {
        setActiveTab(screen);
        navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.tab}
                onPress={() => handleNavigation('Home')}
            >
                <SimpleLineIcons name="home" size={24} color={activeTab === 'Home' ? COLORS.primary : COLORS.black} />
                {/* <Text style={[styles.label, { color: activeTab === 'Home' ? COLORS.primary : COLORS.black }]}>Home</Text> */}
            </TouchableOpacity>

            {userId && (
                <TouchableOpacity
                    style={styles.tab}
                    onPress={() => handleNavigation('MyOrders')}
                >
                    <Ionicons name="gift-outline" size={24} color={activeTab === 'MyOrders' ? COLORS.primary : COLORS.black} />
                    {/* <Text style={[styles.label, { color: activeTab === 'MyOrders' ? COLORS.primary : COLORS.black }]}>Orders</Text> */}
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.tab}
                onPress={() => handleNavigation('Cart')}
            >
                <View style={styles.cartIconContainer}>
                    <Ionicons name={activeTab === 'Cart' ? "cart-sharp" : "cart-outline"} size={24} color={activeTab === 'Cart' ? COLORS.primary : COLORS.black} />
                    {cartCounter > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartCounter}</Text>
                        </View>
                    )}
                </View>
                {/* <Text style={[styles.label, { color: activeTab === 'Cart' ? COLORS.primary : COLORS.black }]}>Cart</Text> */}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.tab}
                onPress={() => handleNavigation(userId ? 'Profile' : 'Login')}
            >
                <Ionicons name="person-outline" size={24} color={activeTab === (userId ? 'Profile' : 'Login') ? COLORS.primary : COLORS.black} />
                {/* <Text style={[styles.label, { color: activeTab === (userId ? 'Profile' : 'Login') ? COLORS.primary : COLORS.black }]}>
                    {userId ? 'Profile' : 'Login'}
                </Text> */}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        height: Platform.OS === 'ios' ? 90 : 60,
        elevation: 5,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
    cartIconContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: -5,
        right: -10,
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

export default FooterNavigation;
