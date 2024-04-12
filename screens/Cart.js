import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
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

const Cart = ({ navigation }) => {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  const fetchData = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      const response = await GeneralService.listCartByUserId(userId);
      const { data } = response;
      const { response: res } = data;
      const totalPrice = res.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.quantity * currentValue.product_price);
      }, 0);
      setTotalPrice(totalPrice);
      setCart(res);
    } catch (err) {
      console.log("Error");
      console.log(err);
      setCart([]);
    }
  }

  useFocusEffect(() => {
    // console.log("called");
    fetchData();

  })

  // useEffect(() => {
  //   console.log("fetched");
  //   fetchData();
  // }, [navigation]);

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
        let userId = await AsyncStorage.getItem("_id");
        const response = await GeneralService.deleteCart(userId, id);
        console.log(response.data.response);

        fetchData();

      } catch (err) {
        console.log(err?.response?.data);
      }
    }

    delCart();
    // setQuantity(quantity + 1);
  };

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
          {/* <TouchableOpacity
            onPress={() => console.log("Edit Items")}
          >
            <Text style={{ fontSize: 14, fontFamily: 'bold', textTransform: 'uppercase', color: COLORS.green }}>Done</Text>
          </TouchableOpacity> */}
        </View>

        <FlatList
          data={cart}
          // data={cartData}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            // console.log("index");

            return (
              <View key={index} style={cartStyles.cartItemContainer}>
                <View style={{ marginRight: 2, width: 120 }}>
                  <Image
                    // source={images.food}
                    source={{ uri: `https://api.veggieking.pk/resources/images/${item.product_image}` }}
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
                      <Image
                        source={icons.close}
                        resizeMode="contain"
                        style={{
                          width: 12,
                          width: 12,
                          tintColor: COLORS.white
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={{
                    fontSize: 20,
                    fontFamily: 'bold',
                    color: COLORS.white,
                    marginVertical: 6
                  }}>Rs. {item.product_price}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{
                      fontSize: 16,
                      color: COLORS.white,
                      fontFamily: 'regular'
                    }}>{item.product_type}</Text>
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
              id="Address"
              placeholder="2118 Thornridge Cir. Syracuse"
              placeholderTextColor={COLORS.gray4}
              editable={true}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={cartStyles.body3}>Total:</Text>
                <Text style={{ fontSize: 24, fontFamily: "bold", color: COLORS.black, marginLeft: 12 }}>Rs. {totalPrice}</Text>
              </View>
            </View>

            <Button
              filled
              title="PLACE ORDER"
              onPress={() => navigation.navigate("PaymentMethod")}
              style={{ marginVertical: 2 }}
            />
          </Animatable.View>
        )
      }


    </SafeAreaView>
  )
}

export default Cart