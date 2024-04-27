import {
  Dimensions, View, Text, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, FlatList,
  ActivityIndicator, Alert, useWindowDimensions
} from
  'react-native'
import React, { useState, useEffect, useRef } from 'react'
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
import { addToCart, decreaseQty, syncProducts, cartCounting } from '../utils/sqlite';
import { ToastAndroid } from 'react-native';
import { cartStyles } from '../styles/CartStyles'
import { useCart } from '../context/CartContext';
import { debounce } from 'lodash';


const HomeV2 = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const { updateCartCounter } = useCart();

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    console.log(contentOffset.x);
    setScrollOffset(contentOffset.x);
  };


  const debouncedScrollToOffset = useRef(debounce(offset => {
    flatListRef.current?.scrollToOffset({ offset, animated: false });
  }, 100)).current;

  useEffect(() => {
    // After the component rerenders, scroll back to the last known position
    debouncedScrollToOffset(scrollOffset);
  }, [scrollOffset]);


  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [cartCounter, setCartCounter] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [featureLoading, setFeatureLoading] = useState(false);
  const [category, setCategory] = useState(Array.from({ length: 6 }, (_, index) => ({ id: index, name: 'Loading...', image: '' })));
  const [moreProd, setMoreProd] = useState([]);
  const [vegetables, setVegetables] = useState(Array.from({ length: 6 }, (_, index) => ({ id: index, name: 'Loading...', image: '', price: '', quantity_added: '' })));
  const [fruits, setFruits] = useState(Array.from({ length: 6 }, (_, index) => ({ id: index, name: 'Loading...', image: '', price: '', quantity_added: '' })));
  const [prodCategory, setProdCategory] = useState([]);
  const [prodCatLoading, setProdCatLoading] = useState(false);

  const navigate = useNavigation();

  const handlePressGotIt = () => {
    setModalVisible(false);
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const decreaseQuantity = (type, prodId) => {
    const decreaseQnty = async () => {
      try {

        if (type == "fruits") {
          const updatedProducts = fruits.map(product => {
            if (product.id === prodId) {
              return {
                ...product,
                quantity_added: parseInt(product.quantity_added || 0) - 1
              };
            }
            return product;
          });
          setFruits(updatedProducts);
        } else if (type == "vegetables") {
          const updatedProducts = vegetables.map(product => {
            if (product.id === prodId) {
              return {
                ...product,
                quantity_added: parseInt(product.quantity_added || 0) - 1
              };
            }
            return product;
          });
          setVegetables(updatedProducts);
          // console.log(updatedProducts);
        }

        const timeout = 2000;
        let userId = await AsyncStorage.getItem("_id");
        const response = await Promise.race([
          GeneralService.decreaseQty(userId, prodId),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
        ]);

        if (response) {
          // console.log(response);
          getCartCounter();
        } else {
          throw new Error('No response from the server');
        }
      } catch (err) {
        // console.log(err?.response?.data);
      }
    }

    decreaseQnty();
  };

  const getCartCounter = async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      const cartResponse = await GeneralService.cartCounterByUserId(userId);
      const { data: cartData } = cartResponse;
      // console.log(`home-data=${cartData}`);
      const { response: cartNo } = cartData;
      setCartCounter(cartNo);
      updateCartCounter(cartNo);
    } catch (err) {
      // console.log(err);
      setCartCounter(0);
    }
  }

  const addCart = async (type, prodId) => {
    try {

      if (type == "fruits") {
        const updatedProducts = fruits.map(product => {
          if (product.id === prodId) {
            return {
              ...product,
              quantity_added: parseInt(product.quantity_added || 0) + 1
            };
          }
          return product;
        });
        setFruits(updatedProducts);
      } else if (type == "vegetables") {
        const updatedProducts = vegetables.map(product => {
          if (product.id === prodId) {
            return {
              ...product,
              quantity_added: parseInt(product.quantity_added || 0) + 1
            };
          }
          return product;
        });
        setVegetables(updatedProducts);
        // console.log(flatListRef.current);
        // if (flatListRef.current) {
        //   flatListRef.current.scrollToOffset({ animated: false, offset: flatListRef.current.contentOffset });
        //   console.log(flatListRef.current.contentOffset);
        // }
        // console.log(updatedProducts);
      }

      const timeout = 2000;
      let userId = await AsyncStorage.getItem("_id");
      const response = await Promise.race([
        GeneralService.addCart(userId, prodId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
      ]);

      if (response) {
        getCartCounter();
      } else {
        throw new Error('No response from the server');
      }

    } catch (err) {
      // showToast("Error adding to cart");
    }
  }


  useEffect(() => {
    // const fetchAllProducts = async () => {
    //   const response = await GeneralService.listAllProducts();
    //   const { response: res } = await syncProducts(response.data.response);
    // }
    // fetchAllProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      categories();
      fetchVegetables();
      fetchFruits();
      fetchAddress();
      return () => {
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
      // console.log(error);
      setCategoryLoading(false);
      setCategory([]);
      Alert.alert("Error", "No response from server");
    }
  };

  const fetchVegetables = async () => {
    try {
      setFeatureLoading(true);

      let userId = await AsyncStorage.getItem("_id");
      // console.log(`user-id=${userId}`);
      const timeout = 8000;
      const response = await Promise.race([
        GeneralService.listProductByCatCart(2, userId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
      ]);
      if (response) {
        setVegetables(response.data.response);
      } else {
        throw new Error('No response from the server');
      }

      setFeatureLoading(false);
    } catch (error) {
      setFeatureLoading(false);
      setVegetables([]);
    }
  };

  const fetchFruits = async () => {
    try {
      setFeatureLoading(true);

      const timeout = 8000;
      let userId = await AsyncStorage.getItem("_id");
      const response = await Promise.race([
        GeneralService.listProductByCatCart(1, userId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
      ]);

      if (response) {
        setFruits(response.data.response);
      } else {
        throw new Error('No response from the server');
      }

      setFeatureLoading(false);
    } catch (error) {
      setFeatureLoading(false);
      setFruits([]);
    }
  };

  const fetchAddress = async () => {
    let userAddress = await AsyncStorage.getItem("user_address");
    setUserAddress(userAddress);
  };

  useFocusEffect(
    React.useCallback(() => {
      getCartCounter();
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
          scrollAnimationDuration={3500}
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
    const { width } = useWindowDimensions();
    const numColumns = width > 600 ? 4 : 3;
    let result = <>
      <View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
        }}>
          <Text style={{ ...FONTS.body2 }}>Categories</Text>
        </View>

        <View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 8 }}>
            {category.map((item, index) => {
              // Define an array of border colors
              const borderColors = ['#FF6347', '#6A5ACD', '#32CD32', '#FFD700', '#20B2AA', '#9370DB', '#FF8C00', '#00CED1', '#8A2BE2', '#ADFF2F'];
              // Use modulo operator to ensure the index is within the range of borderColors array
              const borderColorIndex = index % borderColors.length;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigate.navigate("CategoryProducts", {
                    catId: item.id, catName: item.name
                  })}
                  style={{
                    alignItems: 'center',
                    marginBottom: 15,
                    width: `${100 / numColumns}%`,
                  }}
                >
                  <View style={{
                    height: 90,
                    width: 90,
                    borderRadius: 45,
                    overflow: 'hidden',
                    shadowColor: '#F1F1F1',
                    shadowOffset: {
                      width: 2,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,
                    elevation: 5,
                    borderWidth: 2, // Add borderWidth
                    borderColor: borderColors[borderColorIndex], // Assign different borderColor
                    backgroundColor: 'orange',
                  }}>
                    <Image
                      source={{ uri: `https://api.veggieking.pk/public/upload/${item.image}` }}
                      resizeMode='cover'
                      style={{
                        flex: 1,
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  </View>
                  <Text style={{ fontSize: 16, fontFamily: 'bold', textAlign: 'center', marginTop: 5 }}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View >
    </>

    let response = category.length > 0 ? result : <View style={{ flex: 1 }}>
      <Text style={{
        color: COLORS.black,
        fontSize: 14,
        fontFamily: 'regular',
        textAlign: 'center'
      }}>No record found</Text></View>;

    response = result
    return (
      response
    )
  }


  const renderProducts = (title, type, prodsData, isLast) => {
    const [quantity, setQuantity] = useState(1);
    const width = Dimensions.get('window').width;

    const numColumns = 2;
    let marginBottomStyle = {};
    if (isLast) {
      marginBottomStyle = { marginBottom: "20%" };
    }

    let result = <View style={{ flex: 1, ...marginBottomStyle }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        alignItems: 'center',
      }}>
        <Text style={{ ...FONTS.body2 }}>{title}</Text>
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

      <FlatList
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // onContentSizeChange={() => {
        //   flatListRef.current?.scrollToOffset({ offset: scrollOffset, animated: false });
        // }}
        // onLayout={() => {
        //   flatListRef.current?.scrollToOffset({ offset: scrollOffset, animated: false });
        // }}
        // data={data}
        // maintainVisibleContentPosition={{ autoscrollToTopThreshold: 1 }}
        // maintainVisibleContentPosition={{
        //   autoscrollToTopThreshold: 1,
        //   minIndexForVisible: 1,
        // }}
        data={prodsData} keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 8 }}
        // style={{ marginBottom: "20%" }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("FoodDetails", { id: item.id, name: item.name, image: item.image, price: item.price, minQty: 1, type: "kg" })}
              key={index}
              style={{
                flexDirection: 'column',
                paddingHorizontal: 2,
                paddingVertical: 4,
                height: "auto",
                width: 200,
                borderWidth: 1,
                borderColor: COLORS.gray6,
                borderRadius: 15,
                marginRight: 6,
                marginBottom: 16
              }}>
              <Image
                source={{ uri: `https://api.veggieking.pk/public/upload/${item.image}` }}
                resizeMode='cover'
                style={{ width: "100%", height: 84, borderRadius: 15 }}
              />
              <Text style={{ fontSize: 14, fontFamily: "bold", marginVertical: 4 }}>{item.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontFamily: 'bold' }}>Rs. {item.price}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {item.quantity_added >= 1 && (
                    <>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(type, item.id)}
                        style={[cartStyles.roundedBtn, { backgroundColor: '#f44c00', marginRight: 4 }]}>
                        <Text style={cartStyles.body2}>-</Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 16, fontFamily: 'regular', marginHorizontal: 4 }}>{item.quantity_added}</Text>
                    </>
                  )}
                  <TouchableOpacity onPress={() => addCart(type, item.id)} style={[cartStyles.roundedBtn, { backgroundColor: '#f44c00' }]}>
                    <Text style={cartStyles.body2}>+</Text>
                  </TouchableOpacity>

                </View>
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

    response = result
    return (
      response
    );
  }

  const ProductsHorizontalScrollView = () => {
    // Sample product data
    const products = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
      { id: 3, name: 'Product 3' },
      { id: 4, name: 'Product 4' },
      { id: 5, name: 'Product 5' },
      { id: 6, name: 'Product 6' },
      { id: 7, name: 'Product 7' },
      { id: 8, name: 'Product 8' },
      { id: 9, name: 'Product 9' },
      { id: 10, name: 'Product 10' },
    ];

    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollViewContent}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.area}>
      {/* <View style={{ flex: 1, marginHorizontal: 16 }}> */}
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


        </View>

        {
          screenLoading ?
            <ActivityIndicator size="large" color="blue" /> : null
        }

        {/* {ProductsHorizontalScrollView()} */}

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCarousel()}
          {renderCategories()}
          {/* {renderVegetables()} */}
          {renderProducts("Vegetables", "vegetables", vegetables)}
          {/* {renderProducts("Fruits", "fruits", fruits, true)} */}
        </ScrollView>
        {/* {ProductsHorizontalScrollView()} */}

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