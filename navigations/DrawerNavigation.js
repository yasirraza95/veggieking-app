import "react-native-gesture-handler";
import { View, Text, Image } from "react-native";
import {
  Feather,
  Ionicons,
  AntDesign
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { COLORS, images } from "../constants";
import { Address, Menu, Notifications, PaymentMethod, Cart, MyOrders, HomeV1, HomeV2, Search, TrackingOrderV1, History, TrackingOrderV2, TransactionHistory, PersonalProfile } from "../screens";
import Otp from "../screens/Otp";
import Logout from "../screens/Logout";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      let name = await AsyncStorage.getItem("user_name");
      setName(name);
    }
    fetchInfo();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={
        (props) => {
          return (
            <SafeAreaView>
              <View
                style={{
                  height: 200,
                  width: '100%',
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={images.icon}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50
                  }}
                />

                <Text
                  style={{
                    fontSize: 18,
                    marginVertical: 6,
                    fontFamily: "bold",
                    color: COLORS.black
                  }}
                >{name}</Text>
                {/* <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                    fontFamily: 'regular'
                  }}
                >Product Manager</Text> */}
              </View>
              <DrawerItemList {...props} />
            </SafeAreaView>
          )
        }
      }
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLORS.white,
          width: 250,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerShown: false,
        headerTintColor: COLORS.black,
        headerTitleStyle: {
          fontWeight: "bold"
        },
        drawerLabelStyle: {
          color: COLORS.black,
          fontFamily: "regular",
          fontSize: 14,
          marginLeft: -10,
        }
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="home-outline" size={24} color={COLORS.black} />
          )
        }}
        component={HomeV2}
      />
      <Drawer.Screen
        name="Profile"
        options={{
          drawerLabel: "Profile",
          title: "Profile",
          headerShadowVisible: false,
          drawerIcon: () => (
            <Ionicons name="briefcase-outline" size={24} color={COLORS.black} />
          )
        }}
        component={PersonalProfile}
      />
      <Drawer.Screen
        name="Orders"
        options={{
          drawerLabel: "Orders",
          title: "Orders",
          drawerIcon: () => (
            <Ionicons name="gift-outline" size={24} color={COLORS.black} />
          )
        }}
        component={MyOrders}
      />
      {/* <Drawer.Screen
        name="Otp"
        options={{
          drawerLabel: "OTP",
          title: "Otp",
          drawerIcon: () => (
            <Ionicons name="gift-outline" size={24} color={COLORS.black} />
          )
        }}
        component={Otp}
      /> */}
      {/* <Drawer.Screen
        name="Search"
        options={{
          drawerLabel: "Search",
          title: "Search",
          drawerIcon: () => (
            <Ionicons name="search-outline" size={24} color={COLORS.black} />
          )
        }}
        component={Search}
      /> */}
      <Drawer.Screen
        name="Cart"
        options={{
          drawerLabel: "Cart",
          title: "Cart",
          drawerIcon: () => (
            <Ionicons name="cart-outline" size={24} color={COLORS.black} />
          )
        }}
        component={Cart}
      />

      <Drawer.Screen
        name="Logout"
        options={{
          drawerLabel: "Logout",
          title: "Logout",
          drawerIcon: () => (
            <Ionicons name="log-out-outline" size={24} color={COLORS.black} />
          )
        }}
        component={Logout}
      />

      {/* <Drawer.Screen
        name="Delivery Address"
        options={{
          drawerLabel: "Delivery Address",
          title: "Delivery Address",
          drawerIcon: () => (
            <Ionicons name="location-outline" size={24} color={COLORS.black} />
          )
        }}
        component={Address}
      /> */}
      {/* <Drawer.Screen
        name="Payment Methods"
        options={{
          drawerLabel: "Payment Methods",
          title: "Payment Methods",
          drawerIcon: () => (
            <AntDesign name="creditcard" size={24} color={COLORS.black} />
          )
        }}
        component={PaymentMethod}
      /> */}
      {/* <Drawer.Screen
        name="Notifications"
        options={{
          drawerLabel: "Notifications",
          title: "Notifications",
          drawerIcon: () => (
            <Ionicons name="notifications-outline" size={24} color={COLORS.black} />
          )
        }}
        component={Notifications}
      /> */}
      {/* <Drawer.Screen
        name="Help"
        options={{
          drawerLabel: "Help",
          title: "Help",
          drawerIcon: () => (
            <Feather name="help-circle" size={24} color={COLORS.black} />
          )
        }}
        component={Menu}
      /> */}
    </Drawer.Navigator>
  )
}

export default DrawerNavigation