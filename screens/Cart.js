import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ActivityIndicator, Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons } from '../constants'
import * as Animatable from "react-native-animatable"
import { cartStyles } from '../styles/CartStyles'
import { commonStyles } from "../styles/CommonStyles"
import Input from '../components/Input'
import Button from '../components/Button'
import { cartData } from '../data/utils'
import { StatusBar } from 'expo-status-bar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GeneralService from '../services/general.service'
import { useFocusEffect } from '@react-navigation/native'
import { listCart } from '../utils/sqlite';
import { FontAwesome } from '@expo/vector-icons';

const Cart = ({ navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [itemNo, setItemNo] = useState(0)
  const [cartCounter, setCartCounter] = useState(0);
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const getCartCounter = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      const cartResponse = await GeneralService.cartCounterByUserId(userId);
      const { data: cartData } = cartResponse;
      console.log(`home-data=${cartData}`);
      const { response: cartNo } = cartData;
      setCartCounter(cartNo);

    } catch (err) {
      console.log(err);
      setCartCounter(0);
    }
  }

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  // const { response, status } = await listCart('user_id');
  // console.log(response, status);


  const fetchDataNew = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      let userAddress = await AsyncStorage.getItem("user_address");
      setInputText(userAddress);
      const response = await listCart(userId);
      const { response: res } = response;

      console.log(`success-cart=${res}`);
      // const { data } = response;
      // const { response: res } = data;
      const totalPrice = res.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.quantity * currentValue.product_price);
      }, 0);

      const numberOfItems = res.reduce((count, obj) => {
        return count + 1;
      }, 0);
      setItemNo(numberOfItems);
      setTotalPrice(totalPrice);
      setCart(res);

    } catch (err) {
      // console.log("Error");
      console.log(err);
      setCart([]);
    }
  }

  const fetchData = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      console.log(`user-id=${userId}`);
      let userAddress = await AsyncStorage.getItem("user_address");
      setInputText(userAddress);
      const response = await GeneralService.listCartByUserId(userId);
      const { data } = response;
      const { response: res } = data;
      const totalPrice = res.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.quantity * currentValue.product_price);
      }, 0);

      const numberOfItems = res.reduce((count, obj) => {
        return count + 1;
      }, 0);
      setItemNo(numberOfItems);
      setTotalPrice(totalPrice);
      setCart(res);

    } catch (err) {
      console.log("Error");
      console.log(err);
      setCart([]);
    }
  }


  const fetchDataOld2 = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      let userAddress = await AsyncStorage.getItem("user_address");
      setInputText(userAddress);
      const response = await GeneralService.listCartByUserId(userId);
      const { data } = response;
      const { response: res } = data;
      const totalPrice = res.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.quantity * currentValue.product_price);
      }, 0);

      const numberOfItems = res.reduce((count, obj) => {
        return count + 1;
      }, 0);
      setItemNo(numberOfItems);
      setTotalPrice(totalPrice);
      setCart(res);

    } catch (err) {
      console.log("Error");
      console.log(err);
      setCart([]);
    }
  }

  const fetchDeliveryCharges = async () => {
    try {
      const response = await GeneralService.getCharges();
      const { data } = response;
      const { response: res } = data;
      // console.log(res);
      setDeliveryCharges(res.price);
    } catch (err) {
      setDeliveryCharges(0);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchDeliveryCharges();
    }, [])
  );

  const decreaseQuantity = (id) => {
    const decreaseQty = async () => {
      try {
        let userId = await AsyncStorage.getItem("_id");
        const response = await GeneralService.decreaseQty(userId, id);
        console.log(response.data.response);

        fetchData();

      } catch (err) {
        console.log(err?.response?.data);
      }
    }

    decreaseQty();
  };

  const increaseQuantity = (id) => {
    const increaseQty = async () => {
      try {
        let userId = await AsyncStorage.getItem("_id");
        const response = await GeneralService.increaseQty(userId, id);
        console.log(response.data.response);

        fetchData();

      } catch (err) {
        console.log(err?.response?.data);
      }
    }

    increaseQty();
    // setQuantity(quantity + 1);
  };


  const deleteCart = (id) => {
    console.log(id);
    const delCart = async () => {
      try {
        const response = await deleteToCart(id);
        fetchData();
        showToast("Item removed");

      } catch (err) {
        console.log("delete error");
        console.log(err?.response?.data);
      }
    }

    delCart();
    // setQuantity(quantity + 1);
  };

  const deleteCartOld = (id) => {
    console.log(id);
    const delCart = async () => {
      try {
        let userId = await AsyncStorage.getItem("_id");
        const response = await GeneralService.deleteCart(userId, id);
        // console.log(response.data.response);

        // let cartCounter = await AsyncStorage.getItem("cart_counter");
        // cartCounter = parseInt(cartCounter, 10);
        // cartCounter--;
        // console.log(cartCounter);
        // await AsyncStorage.setItem("cart_counter", cartCounter.toString());
        // setCartCounter(cartCounter);
        // getCartCounter();
        fetchData();

      } catch (err) {
        console.log("delete error");
        console.log(err?.response?.data);
      }
    }

    delCart();
    // setQuantity(quantity + 1);
  };

  const handleInputChange = (text) => {
    setInputText(text);
  };
// TODO address moved to payment method page
  const placeOrder = () => {
    const orderPlace = async () => {
      if (inputText) {
        setInputError("");
        // await clearCart();
        navigation.navigate("PaymentMethod", { total: totalPrice, delivery: deliveryCharges, items: itemNo, address: inputText, userId: 1 });
      } else {
        setInputError("Please enter address");
      }
      console.log(inputText);
    }
// TODO
    if (totalPrice >= 1) {
      orderPlace();
    } else {
      Alert.alert("Price Alert", "Minimum order is Rs 1000");
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.blue }}>
      <StatusBar hidden={true} />
      <View style={cartStyles.header}>

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
            <Text style={{ marginLeft: 12, fontSize: 17, fontFamily: 'regular', color: COLORS.white }}>Cart</Text>
          </View>
        </View>

        <FlatList
          data={cart}
          showsVerticalScrollIndicator={false}
          // data={cartData}
          keyExtractor={item => item.id}
          // ListHeaderComponent={() => (
          //   <View style={styles.bannerContainer}>
          //     <Text style={styles.bannerText}>Get Rs.50 Discount</Text>
          //     <Text style={styles.bannerDescription}>
          //       Rs.50 Discount on orders above Rs.2500
          //     </Text>
          //   </View>
          // )}
          renderItem={({ item, index }) => {

            let result = <View key={index} style={cartStyles.cartItemContainer}>
              <View style={{ marginRight: 2, width: 120 }}>
                <Image
                  // source={images.food}
                  source={{ uri: `https://api.veggieking.pk/public/upload/${item.product_image}` }}
                  resizeMode='cover'
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: 30,
                  }}
                />
              </View>
              <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: "100%",
                width: SIZES.width - 152,
                paddingLeft: 10,
                paddingRight: 6
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.white,
                      fontFamily: 'regular',
                      textTransform: 'capitalize',
                      marginRight: 20
                    }}>{item.product_name}</Text>
                  <TouchableOpacity
                    // onPress={() => console.log("Close cart items")}
                    onPress={() => deleteCart(item.prod_id)}
                    style={{
                      height: 26,
                      width: 26,
                      borderRadius: 13,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.red,
                      marginTop: 2
                    }}
                  >
               <TouchableOpacity
  onPress={() => deleteCart(item.prod_id)}
  style={styles.closeButton}
>
  <FontAwesome name="trash" size={16} color={COLORS.white} />
</TouchableOpacity>
                  </TouchableOpacity>
                </View>

                <Text style={{
                  fontSize: 16,
                  fontFamily: 'regular',
                  color: COLORS.white,
                  marginVertical: 6
                }}>Rs. {item.product_price}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    fontSize: 20,
                    color: COLORS.white,
                    fontFamily: 'bold'
                  }}>Rs. {item.product_price * item.quantity}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => decreaseQuantity(item.prod_id)}
                      style={cartStyles.roundedBtn}
                    >
                      <Text style={cartStyles.body2}>-</Text>
                    </TouchableOpacity>
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'regular',
                      color: COLORS.white,
                      marginHorizontal: 12
                    }}>{item.quantity}</Text>
                    <TouchableOpacity
                      // id={item.id}
                      onPress={() => increaseQuantity(item.prod_id)}
                      style={cartStyles.roundedBtn}
                    >
                      <Text style={cartStyles.body2}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            let response = cart.length > 0 ? result : <View style={{ flex: 1 }}>
              <Text style={{
                color: COLORS.black,
                fontSize: 14,
                fontFamily: 'regular',
                textAlign: 'center'

              }}>No record found</Text></View>;

            response = isLoading ? <ActivityIndicator size="large" color="white" /> : result

            return (
              response
            )
          }
          }
        />
      </View>
      {
        cart.length > 0 && (
          <Animatable.View animation="fadeInUpBig" style={cartStyles.footer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={cartStyles.body3}>Delivery Address</Text>
            </View>
            <Input
              name="address"
              id="address"
              onChangeText={handleInputChange}
              value={inputText}
              placeholder="Delivery Address"
              placeholderTextColor={COLORS.gray4}
              keyboardType="text"
            />
            {inputError && <Text style={styles.error}>{inputError}</Text>}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={cartStyles.body3}>Total:</Text>
                <Text style={{ fontSize: 24, fontFamily: "bold", color: COLORS.black, marginLeft: 12 }}>Rs. {totalPrice}</Text>
              </View>
            </View>

            <Button
              filled
              title="PLACE ORDER"
              isEnable={true}
              // onPress={() => navigation.navigate("PaymentMethod")}
              onPress={() => placeOrder()}
              style={{ marginVertical: 0 }}
            />
          </Animatable.View>
        )
      }


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  error: {
    color: "red"
  },
  bannerContainer: {
    backgroundColor: '#f44c00', 
    padding: 16, 
    marginTop: 10,
    marginBottom: 16, 
    borderRadius: 12, 
    // flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  bannerText: {
    fontSize: 20, 
    fontFamily: 'bold', 
    color: '#FFFFFF', 
  },
  bannerDescription: {
    fontSize: 16, 
    fontFamily: 'regular', 
    color: '#FFFFFF', 
  },
  
  
});

export default Cart