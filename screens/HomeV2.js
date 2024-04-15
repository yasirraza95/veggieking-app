import {
  Dimensions, View, Text, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, Alert
} from
  'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import { Feather, Ionicons, MaterialIcons, AntDesign, Octicons, MaterialCommunityIcons, Fontisto } from
  "@expo/vector-icons"
import { ScrollView } from 'react-native-virtualized-view'
import { StatusBar } from 'expo-status-bar'
import CustomModal from '../components/CustomModal'
import Carousel from 'react-native-reanimated-carousel';
import restaurant6 from '../assets/images/restaurants/restaurant6.png';
import restaurant7 from '../assets/images/restaurants/restaurant7.jpg';
import restaurant8 from '../assets/images/restaurants/restaurant8.png';
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { categories } from '../data/categories'
import MyLoader from './MyLoader'

const HomeV2 = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [cartCounter, setCartCounter] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [moreProd, setMoreProd] = useState([]);

  const navigate = useNavigation();

  const handlePressGotIt = () => {
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const addCart = async (id) => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      setScreenLoading(true);

      const timeout = 8000;

      const response = await Promise.race([
        GeneralService.addCart(userId, id),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
      ]);

      if (response) {

        let cartCounter = await AsyncStorage.getItem("cart_counter");
        cartCounter = parseInt(cartCounter, 10);
        cartCounter++;
        await AsyncStorage.setItem("cart_counter", cartCounter.toString());

        setCartCounter(cartCounter);
        setScreenLoading(false);
        // setCategory(response.data.response);
      } else {
        throw new Error('No response from the server');
      }

    } catch (err) {
      setScreenLoading(false);
    }

  }

  useFocusEffect(
    React.useCallback(() => {
      // Code to run when the screen gains focus
      categories();
      featureProducts();
      // cartCounter();
      fetchAddress();

      // Cleanup function (optional)
      return () => {
        // Code to run when the screen loses focus
        console.log('cart Screen blurred');
      };
    }, [])
  );

  const categories = async () => {
    try {
      setCategoryLoading(true);

      const timeout = 8000;
      const response = await Promise.race([
        GeneralService.listAllCategories(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
      ]);

      if (response) {
        setCategory(response.data.response);
      } else {
        throw new Error('No response from the server');
      }

      setCategoryLoading(false);
    } catch (error) {
      console.log(error);
      setCategoryLoading(false);
      setCategory([]);
      Alert.alert("Error", "No response from server");
    }
  };

  const featureProducts = async () => {
    try {
      setFeatureLoading(true);

      const timeout = 8000;
      const response = await Promise.race([
        GeneralService.listFeaturedProducts(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
      ]);

      if (response) {
        setMoreProd(response.data.response);
      } else {
        throw new Error('No response from the server');
      }

      setFeatureLoading(false);
      console.error('More products fetched');
    } catch (error) {
      setFeatureLoading(false);
      setMoreProd([]);
    }
  };

  const fetchAddress = async () => {
    let userAddress = await AsyncStorage.getItem("user_address");
    // let cartCounter = await AsyncStorage.getItem("cart_counter");
    console.log(userAddress);
    setUserAddress(userAddress);
  };

  useEffect(() => {
    // const cartCounter = async () => {
    // let cartCounter = await AsyncStorage.getItem("cart_counter");
    // // let cartCounter = await AsyncStorage.getItem("cart_counter");
    // console.log(`cart-counter=${cartCounter}`);
    // setCartCounter(cartCounter);
    // };

    // cartCounter();
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      // Code to run when the screen gains focus
      const cartCounter = async () => {
        let cartCounter = await AsyncStorage.getItem("cart_counter");
        // let cartCounter = await AsyncStorage.getItem("cart_counter");
        console.log(`cart-counter=${cartCounter}`);
        setCartCounter(cartCounter);
      };

      cartCounter();

      // Cleanup function (optional)
      return () => {
        // Code to run when the screen loses focus
        console.log('home Screen blurred');
      };
    }, [])
  );

  const renderCarousel = () => {
    const width = Dimensions.get('window').width;
    return (
      <View style={{ height: "auto" }}>
        <View style={{
          marginVertical: 10,
        }}>
        </View>

        <Carousel loop width={width} height={width / 3} autoPlay={true} data={[restaurant6, restaurant7, restaurant8,]}
          scrollAnimationDuration={3500} onSnapToItem={(index) => console.log('current index:', index)}
          style={{
            width: SIZES.width - 32,
            borderColor: COLORS.tertiaryGray,
            borderWidth: 1,
            paddingBottom: 2,
            marginBottom: 12,
            borderRadius: 15
          }}
          renderItem={({ item, index }) => (
            <View style={{
              flex: 1,
              borderWidth: 1,
              justifyContent: 'center',
            }}>
              <Image source={item} style={{
                width: SIZES.width - 1,
                height: width / 2,
                borderRadius: 15
              }} />
            </View>
          )}
        />
      </View>
    );
  }

  const renderProductItem = () => {
    // return (
    <TouchableOpacity style={{
      alignItems: 'center',
      margin: 8,
    }} onPress={() => navigateToProductView(item.id)}
    >
      <View style={{
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'lightgray',
      }}>
        <Image source={item.image} style={{ width: '50%', height: '100%', borderRadius: 50 }} />
      </View>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.name}</Text>
      <Text style={{ color: 'green' }}>{item.discount}</Text>
    </TouchableOpacity>
    // );

    return (
      <FlatList data={products} keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderProductItem}
        contentContainerStyle={{ padding: 16 }}
      />
    )
  }

  const renderCategories = () => {
    let result = <>
      <View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
        }}>
          <Text style={{ ...FONTS.body2 }}>Categories</Text>
          <TouchableOpacity // onPress={()=> console.log("See all category")}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
          </TouchableOpacity>
        </View>

        <FlatList horizontal={true} data={category} keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <TouchableOpacity key={index} onPress={() => navigate.navigate("CategoryProducts", {
                  catId: item.id, catName:
                    item.name
                })}
                >
                  <View style={{
                    height: 90,
                    width: 90,
                    borderRadius: 61,
                    overflow: 'hidden',
                    shadowColor: '#F1F1F1',
                    margin: 5,
                    shadowOffset: {
                      width: 12,
                      height: 12,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 0.1,
                    borderColor: COLORS.tertiaryGray,
                    borderWidth: 2,
                    backgroundColor: 'orange',
                    borderColor: "#c65201",
                  }}>
              <Image source={{ uri: `https://api.veggieking.pk/resources/images/${item.image}` }} resizeMode='cover'
                style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }} />
            </View >
  <Text style={{ fontSize: 16, fontFamily: 'bold', marginTop: 10, textAlign: 'center' }}>{item.name}</Text>
          </TouchableOpacity >
        </View >
        )
        }}
/>
    </View >
  </>

  let response = category.length > 0 ? result : <View style={{ flex: 1 }}>
    <Text style={{
      color: COLORS.black,
      fontSize: 14,
      fontFamily: 'regular',
      textAlign: 'center'
    }}>No record found</Text></View>;

response = categoryLoading ?
  <ActivityIndicator size="large" color="blue" /> : result
return (
  response
)
  }

const renderFeatureProducts = () => {
  const [quantity, setQuantity] = useState(1);

  const numColumns = 2;
  let result = <View style={{ flex: 1 }}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
      alignItems: 'center',
      paddingHorizontal: 16
    }}>
      <Text style={{ ...FONTS.body2 }}>Featured Products</Text>
      <TouchableOpacity onPress={() => navigation.navigate("RestaurantView")}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'regular' }}>See All</Text>
        <View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray4} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        if (quantity > 2) {
          setQuantity(quantity - 1)
        }
      }}
        style={{
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)'
        }}
      >
        <Text style={{ color: COLORS.white }}>-</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 16, color: COLORS.white }}>{quantity}</Text>
      <TouchableOpacity onPress={() => setQuantity(quantity + 1)}
        style={{
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.2)'
        }}
      >
        <Text style={{ color: COLORS.white }}>+</Text>
      </TouchableOpacity>
    </View>
    <FlatList data={moreProd} keyExtractor={item => item.id}
      numColumns={numColumns}
      contentContainerStyle={{ paddingHorizontal: 8 }}
      style={{
        marginBottom: "30%",
      }}
      renderItem={({ item, index }) => {
        return (
      <TouchableOpacity key={index} onPress={()=> navigate.navigate("FoodDetails", { id: item.id, name: item.name,
        image: item.image, price: item.price, minQty: 1, type: "kg" })}
        style={{
                flex: 1,
                margin: 8,
                borderColor: "#f78c47",
                borderWidth: 1,
                borderRadius: 20
              }}
        >

        {/* <MyLoader/> */}

        <Image source={{ uri: `https://api.veggieking.pk/public/upload/${item.image}` }} resizeMode='cover' style={{
                width: '100%',
                height: 136,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }} />

            <TouchableOpacity onPress={() => addCart(item.id)}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                position: 'absolute',
                right: 0
              }}>
              <AntDesign name="plus" size={12} color={COLORS.white} />
            </TouchableOpacity>
            <View style={{
              padding: 8,
              // bottom: 10,
            }}>

              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap-reverse',
                position: 'relative',
              }}>
                <Text style={{ fontSize: 18, textTransform: 'capitalize', }}>{item.name}</Text>
                {/* <TouchableOpacity onPress={()=> addCart(item.id)}
              style={{
                      height: 30,
                      width: 30,
                      borderRadius: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.primary,
                      position: 'absolute', // absolute positioning
                      right: 0 // positioned to the left
                    }}>
              <AntDesign name="plus" size={12} color={COLORS.white} />
            </TouchableOpacity> */}
              </View>
              <Text style={{ fontFamily: 'regular', marginVertical: 3 }}>Rs. {item.price}</Text>
            </View>
          </TouchableOpacity>
        )
      }}
    />
  </View>;

  let response = moreProd.length > 0 ? result : <View style={{ flex: 1 }}>
    <Text style={{
      color: COLORS.black,
      fontSize: 14,
      fontFamily: 'regular',
      textAlign: 'center'
    }}>No record found</Text></View>;

  response = featureLoading ?
    <ActivityIndicator size="large" color="blue" /> : result
  return (
    response
  );
}

return (
  <SafeAreaView style={styles.area}>
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <StatusBar hidden={true} />
      <View style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 20,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}
            style={{
              height: 45,
              width: 45,
              borderRadius: 22.5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.secondaryGray
            }}>
            <Image source={icons.menu} style={{
              height: 24,
              width: 24,
            }} />
          </TouchableOpacity>
          <View style={{
            flexDirection: 'column',
            marginLeft: 12
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: 'bold',
              color: COLORS.primary
            }}>Address</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: 'regular'
              }}>{userAddress ?? "N/A"}</Text>
              {/*
              <Image source={icons.arrowDown2} style={{
                  height: 12,
                  width: 12,
                  marginLeft: 4
                }} /> */}
            </View>
          </View>
        </View>

        {/* cart counter */}
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

      {
        screenLoading ?
          <ActivityIndicator size="large" color="blue" /> : null
      }

      <ScrollView showsVerticalScrollIndicator={false}>

        {renderCarousel()}
        {renderCategories()}
        {renderFeatureProducts()}
      </ScrollView>
    </View>
    <CustomModal modalVisible={modalVisible} setModalVisible={setModalVisible} onPressGotIt={handlePressGotIt}
      code="#1243CD2" />
  </SafeAreaView>
)
  }

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  }
})

export default HomeV2