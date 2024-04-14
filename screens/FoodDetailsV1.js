import { View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import { commonStyles } from '../styles/CommonStyles'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Feather, Ionicons, MaterialCommunityIcons, Fontisto, Octicons } from "@expo/vector-icons";
import { ScrollView } from 'react-native-virtualized-view'
import Button from "../components/Button"
import { StatusBar } from 'expo-status-bar'
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import Toast from '@react-native-toast-message';

const ingridents = [icons.salt, icons.chickenLeg, icons.onion, icons.chili]
const FoodDetailsV1 = ({ route }) => {

  const [cartCounter, setCartCounter] = useState(0);
  const [screenLoading, setScreenLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const cartCounter = async () => {
        let cartCounter = await AsyncStorage.getItem("cart_counter");
        console.log(`cart-counter=${cartCounter}`);
        setCartCounter(cartCounter);
      };

      cartCounter();

    }, [])
  );

  const cartAddition = (id) => {
    console.log(`id=${id}`);

    const addCart = async () => {
      try {
        let userId = await AsyncStorage.getItem("_id");
        setScreenLoading(true);

        const timeout = 8000;
        const response = await Promise.race([
          GeneralService.addCart(userId, id),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
        ]);

        if (response) {
          if (response.status == 200) {
            let cartCounter = await AsyncStorage.getItem("cart_counter");
            cartCounter = parseInt(cartCounter, 10);
            cartCounter++;
            await AsyncStorage.setItem("cart_counter", cartCounter.toString());
          }

          setCartCounter(cartCounter);
          setScreenLoading(false);
        } else {
          throw new Error('No response from the server');
        }
      } catch (err) {
        setScreenLoading(false);
      }
    }
    addCart();
  }

  const { id, name, image, price, minQty, type } = route.params;
  const renderHeader = () => {
    const navigation = useNavigation()
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.header1Icon}
          >
            <Image
              resizeMode='contain'
              source={icons.arrowLeft}
              style={{ height: 24, width: 24, tintColor: COLORS.black }}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 12, fontSize: 17, fontFamily: 'regular' }}>Product Details</Text>
        </View>

        <View style={{
          height: 45,
          width: 45,
          borderRadius: 22.5,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: COLORS.tertiaryBlack
        }}>
          <View>
            <View style={{
              position: 'absolute',
              top: -16,
              left: 12,
              backgroundColor: COLORS.primary,
              height: 25,
              width: 25,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12.5,
              zIndex: 999
            }}>
              <Text style={{
                fontSize: 16,
                color: COLORS.white
              }}>{cartCounter}</Text>
            </View>
            <Feather name="shopping-bag" size={24} color={COLORS.white} />
          </View>
        </View>
      </View>
    )
  }

  const renderFoodDetails = () => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const navigation = useNavigation();

    const [selectedSize, setSelectedSize] = useState(null);
    const handleSizeSelection = (size) => {
      setSelectedSize(size);
    }
    return (
      <View style={{ marginVertical: 16 }}>
        {/* Food details images */}
        <View>
          <TouchableOpacity
            onPress={() => setIsFavourite(!isFavourite)}
            style={{
              position: 'absolute',
              bottom: 18,
              right: 18,
              zIndex: 999,
              height: 37,
              width: 37,
              borderRadius: 18.5,
              backgroundColor: 'rgba(255,255,255,0.6)',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Ionicons
              name={isFavourite ? "heart-sharp" : "heart-outline"}
              size={24}
              color={isFavourite ? COLORS.primary : COLORS.white} />
          </TouchableOpacity>
          <Image
            source={{ uri: `https://api.veggieking.pk/public/upload/${image}` }}
            resizeMode='contain'
            style={{
              width: SIZES.width - 32,
              height: 184,
              borderRadius: 32,
              borderColor: COLORS.gray6,
              borderWidth: 1
            }}
          />
        </View>
        <View style={{ marginVertical: 16 }}>

          <Text style={{
            fontSize: 18,
            fontFamily: 'bold',
            textTransform: 'capitalize',
            marginVertical: 10
          }}>{name}</Text>
          <View style={{
            backgroundColor: COLORS.tertiaryGray,
            borderRadius: 24,
            paddingHorizontal: 10,
            paddingVertical: 16
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 28, fontFamily: 'regular' }}>Rs. {price}/{type}</Text>

            </View>
            <Button
              filled
              onPress={() => cartAddition(id)}
              isEnable={true}
              title="ADD TO CART"
            />
          </View>
        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar hidden={true} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {renderHeader()}
        {
          screenLoading ?
            <ActivityIndicator size="large" color="blue" /> : null
        }
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderFoodDetails()}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: "center",
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.gray,
    marginRight: 12
  },
  selectedCheckbox: {
    backgroundColor: COLORS.primary
  },
  checkboxText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'regular'
  },
})

export default FoodDetailsV1