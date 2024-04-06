import { Dimensions, View, Text, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, icons, images } from '../constants'
import { Feather, Ionicons, MaterialIcons, Octicons, MaterialCommunityIcons, Fontisto } from "@expo/vector-icons"
import { ScrollView } from 'react-native-virtualized-view'
import { StatusBar } from 'expo-status-bar'
import { categories } from '../data/categories'
import { restaurants } from '../data/restaurants'
import CustomModal from '../components/CustomModal'
import Carousel from 'react-native-reanimated-carousel';

import restaurant6 from '../assets/images/restaurants/restaurant6.png';
import restaurant7 from '../assets/images/restaurants/restaurant7.jpg';
import restaurant8 from '../assets/images/restaurants/restaurant8.png';
import GeneralService from '../services/general.service'

const HomeV2 = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  const handlePressGotIt = () => {
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GeneralService.listAllProducts();
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []);

  
  const renderCarousel = () => {
    const width = Dimensions.get('window').width;
    return (
      <View style={{ height: "auto" }}>
        <View style={{
          marginVertical: 10,
        }}>
        </View>

        {/* <Carousel
          loop
          width={width}
          height={width / 3}
          autoPlay={true}
          data={[...new Array(6).keys()]}
          scrollAnimationDuration={3500}
          onSnapToItem={(index) => console.log('current index:', index)}
          style={{
            width: SIZES.width - 32,
            borderColor: COLORS.tertiaryGray,
            borderWidth: 1,
            paddingBottom: 2,
            marginBottom: 12,
            borderRadius: 15
          }
          }
          renderItem={({ index }) => (
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
              }}
            >
              <Image
                source={images.restaurant6}
                style={{
                  width: SIZES.width - 1,
                  height: width/2,
                  borderRadius: 15
                }}
              />
            </View>
          )}
        /> */}
         <Carousel
      loop
      width={width}
      height={width / 3}
      autoPlay={true}
      data={[restaurant6,restaurant7, restaurant8,]}
      scrollAnimationDuration={3500}
      onSnapToItem={(index) => console.log('current index:', index)}
      style={{
        width: SIZES.width - 32,
        borderColor: COLORS.tertiaryGray,
        borderWidth: 1,
        paddingBottom: 2,
        marginBottom: 12,
        borderRadius: 15
      }}
      renderItem={({ item, index }) => (
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            justifyContent: 'center',
          }}
        >
          <Image
            source={item}
            style={{
              width: SIZES.width - 1,
              height: width / 2,
              borderRadius: 15
            }}
          />
        </View>
      )}
    />
      </View>
    );
  }

  // const renderCarouselOld = () => {
  //   return (
  //     <View style={{ height: "auto" }}>
  //       <View style={{
  //         marginVertical: 10,
  //       }}>
  //       </View>

  //       <TouchableOpacity
  //         onPress={() => navigation.navigate("RestaurantView")}
  //         style={{
  //           width: SIZES.width - 32,
  //           borderColor: COLORS.tertiaryGray,
  //           borderWidth: 1,
  //           paddingBottom: 2,
  //           marginBottom: 12,
  //           borderRadius: 15
  //         }}>
  //         <Image
  //           source={49}
  //           style={{
  //             width: SIZES.width - 32,
  //             height: 136,
  //             borderRadius: 15
  //           }}
  //         />
  //       </TouchableOpacity>

  //     </View>
  //   )
  // }
  
  const renderProductItem = () => {
         return (
          <TouchableOpacity
          style={{
            alignItems: 'center',
            margin: 8,
          }}
          onPress={() => navigateToProductView(item.id)}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              overflow: 'hidden',
              marginBottom: 8,
              borderWidth: 1,
              borderColor: 'lightgray',
            }}
          >
            <Image
              source={item.image}
              style={{ width: '50%', height: '100%', borderRadius: 50 }}
            />
          </View>
          <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ color: 'green' }}>{item.discount}</Text>
        </TouchableOpacity>
      );
    
      return (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderProductItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )
  }
  

  const renderFoodCategories = () => {
    return (
      <>
           <View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
        }}>
          <Text style={{ ...FONTS.body2 }}>All Categories</Text>
          <TouchableOpacity
            onPress={() => console.log("See all category")}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'regular' }}>See All</Text>
            <View>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray4} />
            </View>
          </TouchableOpacity>
        </View>

      <FlatList
          horizontal={true}
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => {
            return (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

              <TouchableOpacity
              key={index}
            >

<View style={{
    height: 90,
    width: 90,
    borderRadius: 61, // Half of the width to make it a circle
    overflow: 'hidden', // Clip the image to the circle
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
              <Image
                source={item.image}
                resizeMode='contain'
                style={{
                  flex: 1,
                  height: '100%',
                  width: '100%',
                }} />
                </View>
                <Text style={{ fontSize: 16, fontFamily: 'bold', marginTop: 10, textAlign: 'center' }}>{item.name}</Text>
              <View style={{
                // flexDirection: "row",
                // justifyContent: "space-between",
                marginTop: 4,
                marginBottom: 10,
              }}>
                {/* <Text style={{ fontSize: 14, fontFamily: 'regular' }}>Starting</Text> */}
                <Text style={{ fontSize: 16, fontFamily: 'regular', textAlign: 'center' }}>${item.startingPrice}</Text>
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
  const renderSearchBar = () => {
    return (
      <View style={{
        width: SIZES.width - 32,
        height: 62,
        borderRadius: 10,
        backgroundColor: COLORS.tertiaryGray,
        alignItems: 'center',
        flexDirection: 'row'
      }}>
        <View style={{
          marginHorizontal: SIZES.padding
        }}>
          <Ionicons name="search" size={24} color={COLORS.gray4} />
        </View>
        <TextInput
          placeholder='Search dishes, restaurants'
          onChangeText={handleSearch}
          placeholderTextColor={COLORS.gray5}
        />
      </View>
    )
  }

  const renderRestaurants = () => {
    const numColumns = 2; // Number of columns per row
  
    const renderItem = ({ item }) => (

      <TouchableOpacity
        onPress={() => navigation.navigate("RestaurantView")}
        style={{
          flex: 1,
          margin: 8,
          borderColor: "#f78c47",
          borderWidth: 1,
          borderRadius: 20
        }}
      >
        <Image
          source={item.image}
          style={{
            width: '100%',
            height: 136,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        />
        <View style={{ padding: 8 }}>
          <Text style={{ fontSize: 18, fontFamily: 'regular', marginVertical: 6 }}>{item.name}</Text>
          <View style={{ marginBottom: 4 }}>
  <Text style={{ fontSize: 14, color: COLORS.gray5 }}>
    {item.keywords.map((keyword, index) => (
      <Text key={index}>
        {index !== 0 && " - "}
        <Text numberOfLines={1} ellipsizeMode="tail" style={{ textTransform: 'capitalize' }}>
          {keyword}
        </Text>
      </Text>
    ))}
  </Text>
</View>

{/* <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
  <View style={{ flexDirection: "row", alignItems: "center", marginRight: SIZES.padding3 }}>
    <Octicons name="star" size={24} color={COLORS.primary} />
    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 8 }}>
      {item.rating}
    </Text>
  </View>
  <View style={{ flexDirection: "row", alignItems: "center", marginRight: SIZES.padding3 }}>
    <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={COLORS.primary} />
    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 8 }}>
      {item.shipping}
    </Text>
  </View>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Fontisto name="stopwatch" size={22} color={COLORS.primary} />
    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginLeft: 8 }}>
      {item.deliveryTime} min
    </Text>
  </View>
</View> */}

        </View>
      </TouchableOpacity>
    );
  
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
          paddingHorizontal: 16
        }}>
          <Text style={{ ...FONTS.body2 }}>Open Restaurants</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("OpenShops")}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'regular' }}>See All</Text>
            <View>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray4} />
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          nestedScrollEnabled
          data={restaurants}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={{ paddingHorizontal: 8 }}
      style={{
        marginBottom: "30%",
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
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{
                height: 45,
                width: 45,
                borderRadius: 22.5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.secondaryGray
              }}>
              <Image
                source={icons.menu}
                style={{
                  height: 24,
                  width: 24,
                }}
              />
            </TouchableOpacity>
            <View style={{
              flexDirection: 'column',
              marginLeft: 12
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: COLORS.primary
              }}>DELIVER TO</Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'regular'
                }}>Halab lab office</Text>
                <Image
                  source={icons.arrowDown2}
                  style={{
                    height: 12,
                    width: 12,
                    marginLeft: 4
                  }}
                />
              </View>
            </View>
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
                }}>2</Text>
              </View>
              <Feather name="shopping-bag" size={24} color={COLORS.white} />
            </View>
          </View>
        </View>

        {/* <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 16
        }}>
          <Text style={{ fontSize: 16, fontFamily: 'regular' }}>Hey Halal,</Text>
          <Text style={{ fontSize: 16, fontFamily: 'bold' }}>Good Afternoon!</Text>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* {renderSearchBar()} */}
          {renderCarousel()}
          {renderFoodCategories()}
          {renderRestaurants()}
        </ScrollView>
      </View>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onPressGotIt={handlePressGotIt}
        code="#1243CD2"
      />
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