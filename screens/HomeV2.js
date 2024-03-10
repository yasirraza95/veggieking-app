import { Dimensions, View, Text, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
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

const HomeV2 = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressGotIt = () => {
    // Handle the logic when the "GOT IT" button is pressed
    // For example, you can close the modal or perform any other action
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  
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
              style={{ width: '100%', height: '100%', borderRadius: 50 }}
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
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={{
                height: 172,
                paddingHorizontal: 8,
                marginHorizontal: 10,
                flexDirection: 'column',
                justifyContent: 'center',
                shadowColor: '#F1F1F1',
                shadowOffset: {
                  width: 12,
                  height: 12,
                },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: .1,
                borderRadius: 24,
                borderColor: COLORS.tertiaryGray,
                borderWidth: 1
              }}
            >
              <Image
                source={item.image}
                resizeMode='contain'
                style={{
                  height: 104,
                  width: 122,
                  borderRadius: 15,
                  marginTop: 10
                }}
              />
              <Text style={{ fontSize: 16, fontFamily: 'bold', marginVertical: 4 }}>{item.name}</Text>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 4,
                marginBottom: 4,
              }}>
                <Text style={{ fontSize: 14, fontFamily: 'regular' }}>Starting</Text>
                <Text style={{ fontSize: 16, fontFamily: 'regular' }}>${item.startingPrice}</Text>
              </View>
            </TouchableOpacity>
          )}
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
    return (
      <View style={{ height: "auto" }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
          alignItems: 'center',
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
          renderItem=
          {({ item, index }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("RestaurantView")}
              style={{
                width: SIZES.width - 32,
                borderColor: COLORS.tertiaryGray,
                borderWidth: 1,
                paddingBottom: 2,
                marginBottom: 12,
                borderRadius: 15
              }}>
              <Image
                source={item.image}
                style={{
                  width: SIZES.width - 32,
                  height: 136,
                  borderRadius: 15
                }}
              />
              <Text style={{ fontSize: 18, fontFamily: 'regular', marginVertical: 6 }}>{item.name}</Text>
              <View style={{ marginBottom: 4, flexDirection: 'row' }}>
                {item.keywords.map((keyword, index) => (
                  <Text key={index} style={{ fontSize: 14, color: COLORS.gray5, textTransform: "capitalize" }}>
                    {keyword}{index !== item.keywords.length - 1 ? "-" : ""}
                  </Text>
                ))}
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Octicons name="star" size={24} color={COLORS.primary} />
                  <Text style={{ marginLeft: 8 }}>{item.rating}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: SIZES.padding3 }}>
                  <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={COLORS.primary} />
                  <Text style={{ marginLeft: 8 }}>{item.shipping}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Fontisto name="stopwatch" size={22} color={COLORS.primary} />
                  <Text style={{ marginLeft: 8 }}>{item.deliveryTime} min</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    )
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