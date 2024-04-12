import { Dimensions, View, Text, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from
  'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import { Feather, Ionicons, MaterialIcons, AntDesign, Octicons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons"
import { ScrollView } from 'react-native-virtualized-view'
import { StatusBar } from 'expo-status-bar'
import CustomModal from '../components/CustomModal'
import Carousel from 'react-native-reanimated-carousel';
import restaurant6 from '../assets/images/restaurants/restaurant6.png';
import restaurant7 from '../assets/images/restaurants/restaurant7.jpg';
import restaurant8 from '../assets/images/restaurants/restaurant8.png';
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const HomeV2 = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [featured, setFeatured] = useState([]);
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
      const response = await GeneralService.addCart(userId, id);
      console.log(response);
      console.log(id);
    } catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {
    const featuredProducts = async () => {
      try {
        setFeaturedLoading(true);
        const response = await GeneralService.listAllProducts();
        setFeatured(response.data.response);
        setFeaturedLoading(false);
        console.error('Featured products fetched');
      } catch (error) {
        setFeaturedLoading(false);
        console.error('Error fetching featured:', error);
      }
    };

    const moreProducts = async () => {
      try {
        setMoreLoading(true);
        const response = await GeneralService.listAllProducts();
        setMoreProd(response.data.response);
        setMoreLoading(false);
        console.error('More products fetched');
      } catch (error) {
        setMoreLoading(false);
        console.error('Error fetching more products:', error);
      }
    };

    const fetchAddress = async () => {
      let userAddress = await AsyncStorage.getItem("user_address");
      console.log(userAddress);
      setUserAddress(userAddress);
    };
    fetchAddress();
    featuredProducts();
    moreProducts();
  }, [navigation]);

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

  const renderFeaturedProducts = () => {
    return (
      <>
        <View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 8,
            alignItems: 'center',
          }}>
            <Text style={{ ...FONTS.body2 }}>Featured Products</Text>
            <TouchableOpacity // onPress={()=> console.log("See all category")}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
            </TouchableOpacity>
          </View>

          <FlatList horizontal={true} data={featured} keyExtractor={item => item.id}
            renderItem={({ item, index }) => {
              return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <TouchableOpacity key={index} onPress={() => navigate.navigate("FoodDetails", { id: item.id, name: item.name, image: item.image, price: item.price, minQty: 1, type: "kg" })}
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
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: 'bold', marginTop: 10, textAlign: 'center' }}>{item.name}</Text>
                    <View style={{
                      marginTop: 4,
                      marginBottom: 10,
                    }}>
                      <Text style={{ fontSize: 16, fontFamily: 'regular', textAlign: 'center' }}>Rs. {item.price}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        </View>
      </>
    )
  }

  const renderMoreProducts = () => {
    const [quantity, setQuantity] = useState(1);

    const numColumns = 2;
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
          paddingHorizontal: 16
        }}>
          <Text style={{ ...FONTS.body2 }}>More Products</Text>
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
              <TouchableOpacity key={index} onPress={() => navigate.navigate("FoodDetails", { id: item.id, name: item.name, image: item.image, price: item.price, minQty: 1, type: "kg" })}
                style={{
                  flex: 1,
                  margin: 8,
                  borderColor: "#f78c47",
                  borderWidth: 1,
                  borderRadius: 20
                }}
              >
                <Image source={{ uri: `https://api.veggieking.pk/resources/images/${item.image}` }} resizeMode='cover' style={{
                  width: '100%',
                  height: 136,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }} />
                <View style={{
                  padding: 8,
                  bottom: 10,
                }}>

                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap-reverse',
                    position: 'relative',
                  }}>
                    {/* <Text style={{ textTransform: 'capitalize', }}>{item.name}</Text> */}
                    <TouchableOpacity
                      onPress={() => addCart(item.id)}
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
                    </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: 18, fontFamily: 'regular', marginVertical: 6 }}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
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
                {/* <Image source={icons.arrowDown2} style={{
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
                }}>0</Text>
              </View>
              <Feather name="shopping-bag" size={24} color={COLORS.white} />
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderCarousel()}
          {renderFeaturedProducts()}
          {renderMoreProducts()}
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