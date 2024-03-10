import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images, icons } from '../constants'
import { commonStyles } from '../styles/CommonStyles'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialCommunityIcons,  Octicons, Fontisto, AntDesign, Ionicons } from "@expo/vector-icons"
import { recentKeywords } from '../data/keywords'
import { popularBurgers } from '../data/foods'
import { Modal } from 'react-native'
import Button from '../components/Button'
import { StatusBar } from 'expo-status-bar'


const RestaurantView1 = () => {

const [modalVisible,setModalVisible] = useState(false);
const [selectedStars, setSelectedStars] = useState(Array(5).fill(false));

  const handleStarPress = (index) => {
    const newSelectedStars = selectedStars.map((_, i) => i <= index);
    setSelectedStars(newSelectedStars);
  };

const renderHeader = () => {
    const navigation = useNavigation()
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
        }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity 
                      onPress={()=>navigation.goBack()}
                      style={commonStyles.header1Icon}
                      >
                        <Image
                          resizeMode='contain'
                          source={icons.arrowLeft}
                          style={{height: 24, width: 24, tintColor: COLORS.black}}
                        />
                </TouchableOpacity>
            <Text style={{marginLeft: 12, fontSize: 17, fontFamily: 'regular'}}>Restaurant View</Text>
          </View>
           <TouchableOpacity
             onPress={()=>setModalVisible(true)}
             style={commonStyles.header1Icon}
           >
                <Image
                  resizeMode='contain'
                  source={icons.more}
                  style={{height: 24, width: 24, tintColor: COLORS.black}}
                />
           </TouchableOpacity>
        </View>
    )
}

const renderRestaurantDetails = ()=>{
  const navigation = useNavigation();
  return (
    <View style={{marginTop: 16}}>
       <Image
        //  source={images.restaurants}
        source={images.restaurant4}
         resizeMode='cover'
         style={{
          width: SIZES.width - 32,
          height: 150,
          borderRadius: 30
         }}
       />

        <Text style={{
                fontSize: 18, 
                fontFamily: 'bold',
                textTransform: 'capitalize',
                marginVertical: 10
                    }}>Spicy Restaurant</Text>
        <Text style={{
                fontSize: 13,
                fontFamily: 'regular',
                color: COLORS.gray5
                }}>Maecenas sed diam eget risus varius blandit sit amet non magna. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</Text>
        <View style={{flexDirection: "row", marginTop: 16}}>
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                         <Octicons name="star" size={24} color={COLORS.primary} />
                         <Text style={{marginLeft: 8}}>4.7</Text>
                      </View> 
                      <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: SIZES.padding3}}>
                      <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={COLORS.primary} />
                         <Text style={{marginLeft: 8}}>Free</Text>
                      </View> 
                      <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Fontisto name="stopwatch" size={22} color={COLORS.primary} />
                         <Text style={{marginLeft: 8}}>20 min</Text>
                      </View> 
        </View>
        {/* Render Keyword related to restaurants */}
        <View style={{ marginVertical: 16}}>
          <FlatList
              horizontal={true}
              data={recentKeywords}
              keyExtractor={item=>item.id}
              renderItem=
              {({ item, index })=>(
                <TouchableOpacity
                onPress={()=>navigation.navigate("FoodByKeywords")}
                style={{
                  height: 46,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: COLORS.gray6,
                  borderRadius: 30,
                  paddingHorizontal: 10,
                  marginHorizontal: 8
                }}
                key={index}>
                  <Text style={{color: COLORS.tertiaryBlack, fontSize: 16}}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
        </View>
    </View>
  )
}

const renderFoodsByCategories = () =>{
  const navigation = useNavigation()
  return (
    <View>
      <Text style={{...FONTS.body3, marginBottom: 12}}>Burger (10) </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: SIZES.width-32,
        }}
      >
          {
            popularBurgers.map((item,index) =>(
              <TouchableOpacity
               onPress={() =>navigation.navigate("FoodDetails")}
               key={index}
              style={{
                flexDirection: 'column',
                paddingHorizontal: 2,
                paddingVertical: 4,
                height: "auto",
                width: 160,
                borderWidth: 1,
                borderColor: COLORS.gray6,
                borderRadius: 15,
                marginRight: "auto",
                marginBottom: 16
                }}>
                  <Image
                    source={item.image}
                    resizeMode='contain'
                    style={{width: "100%", height: 84, borderRadius: 15 }}
                  />
                  <Text style={{fontSize: 14, fontFamily: "bold", marginVertical: 4}}>{item.name}</Text>
                  <Text style={{fontSize: 13, fontFamily: "regular", marginVertical: 4}}>{item.restaurant}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Text style={{fontSize: 15, fontFamily: 'bold'}}>${item.price}</Text>
                      <TouchableOpacity 
                      onPress={() =>console.log("Add to cart")}
                      style={{
                        height: 30, 
                        width: 30, 
                        borderRadius: 15,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: COLORS.primary
                        }}>
                            <AntDesign name="plus" size={12} color={COLORS.white} />
                      </TouchableOpacity>
                  </View>
              </TouchableOpacity>
            ))
          }
      </View>
    </View>
  )
}

const renderSearchModal = ()=>{
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedTime,setSelectedTime] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isStarSelected, setIsStarSelected] = useState(false);

  const handleOfferSelection = (offer)=>{
      setSelectedOffer(offer);
  }

  const handlePriceSelection = (price)=>{
      setSelectedPrice(price);
  }

  const handleTimeSelection = (time)=>{
    setSelectedTime(time)
  }
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
    <TouchableOpacity
      onPressOut={() => setModalVisible(false)}
      activeOpacity={0.1}
      style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        height: SIZES.height,
        width: SIZES.width,
      }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            height: "auto",
            width: SIZES.width * 0.9,
            borderRadius: 12,
            backgroundColor: COLORS.white,
            paddingHorizontal: 12,
          }}
        >
           <View 
           style={{
            width: '100%',
            flexDirection: 'row', 
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12
            }}>
                <Text style={{fontSize: 17, fontFamily: 'bold'}}>Filter your search</Text>
                <TouchableOpacity
                  onPress={()=>setModalVisible(false)}
                  style={commonStyles.header3Icon}
                >
                   <Image
                     source={icons.close}
                     style={{
                      height: 24,
                      width: 24,
                      tintColor: COLORS.black
                     }}
                   />
                </TouchableOpacity>
           </View>
           <View>
                <Text style={{fontSize: 13, fontFamily: 'regular', marginBottom: 10}}>OFFERS</Text>
                <View style={{ flexDirection: "row",  flexWrap: 'wrap', marginVertical: 13 }}>
                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedOffer === "Delivery" && styles.selectedCheckbox
                            ]}
                            onPress={() => handleOfferSelection("Delivery")}
                        >
                            <Text style={[ selectedOffer === "Delivery" && styles.checkboxText]}>Delivery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedOffer === "Pick Up" && styles.selectedCheckbox
                            ]}
                          onPress={() => handleOfferSelection("Pick Up")}
                        >
                            <Text style={[ selectedOffer === "Pick Up" && styles.checkboxText]}>Pick Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedOffer === "Offer" && styles.selectedCheckbox
                            ]}
                          onPress={() => handleOfferSelection("Offer")}
                        >
                            <Text style={
                                [
                                    selectedOffer === "Offer" && styles.checkboxText
                                ]
                            }>Offer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedOffer === "Oline payment available" && styles.selectedCheckbox
                            ]}
                          onPress={() => handleOfferSelection("Oline payment available")}
                        >
                            <Text style={
                                [
                                    selectedOffer === "Oline payment available" && styles.checkboxText
                                ]
                            }>Oline payment available</Text>
                        </TouchableOpacity>

                    </View>
           </View>

           <View>
                <Text style={{fontSize: 13, fontFamily: 'regular', marginBottom: 2}}>DELIVER TIME</Text>
               
                <View style={{ flexDirection: "row", marginVertical: 13 }}>
                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedTime === "10-15" && styles.selectedCheckbox
                            ]}
                            onPress={() => handleTimeSelection("10-15")}
                        >
                            <Text style={[ selectedTime === "10-15" && styles.checkboxText]}>10-15 min</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedTime === "20" && styles.selectedCheckbox
                            ]}
                          onPress={() => handleTimeSelection("20")}
                        >
                            <Text style={[ selectedTime === "20" && styles.checkboxText]}>20 min</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                                styles.checkboxContainer,
                                selectedTime === "30" && styles.selectedCheckbox
                            ]}
                          onPress={() => handleTimeSelection("30")}
                        >
                            <Text style={
                                [
                                    selectedTime === "30" && styles.checkboxText
                                ]
                            }>30 min</Text>
                        </TouchableOpacity>

                </View>
              
           </View>

           <View>
               <Text style={{fontSize: 13, fontFamily: 'regular', marginBottom: 10}}>PRICING</Text>
               <View style={{ flexDirection: "row", marginVertical: 13 }}>
                        <TouchableOpacity
                          style={[
                                styles.roundedCheckBoxContainer,
                                selectedPrice === "$" && styles.selectedCheckbox
                            ]}
                            onPress={() => handlePriceSelection("$")}
                        >
                            <Text style={[ selectedPrice === "$" && styles.checkboxText]}>$</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                                styles.roundedCheckBoxContainer,
                                selectedPrice === "$$" && styles.selectedCheckbox
                            ]}
                          onPress={() => handlePriceSelection("$$")}
                        >
                            <Text style={[ selectedPrice === "$$" && styles.checkboxText]}>$$</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                                styles.roundedCheckBoxContainer,
                                selectedPrice === "$$$" && styles.selectedCheckbox
                            ]}
                          onPress={() => handlePriceSelection("$$$")}
                        >
                            <Text style={
                                [
                                    selectedPrice === "$$$" && styles.checkboxText
                                ]
                            }>$$$</Text>
                        </TouchableOpacity>

                       
               </View>
           </View>
           
           <View>
               <Text style={{fontSize: 13, fontFamily: 'regular', marginBottom: 10}}>RATING</Text>
               <View style={{ flexDirection: 'row', marginVertical: 13 }}>
                  {selectedStars.map((isSelected, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.starContainer}
                      onPress={() => handleStarPress(index)}
                    >
                      <Ionicons
                        name="star-sharp"
                        size={24}
                        color={isSelected ? COLORS.primary : COLORS.gray}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
           </View>

           <Button
             title="FILTER"
             filled
             onPress={()=>setModalVisible(false)}
             style={{
              marginBottom: 12
             }}
           />
        </View>
      </View>
      </TouchableOpacity>
      </Modal>
  )
}
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar hidden={true} />
      <View style={{flex: 1, marginHorizontal: 16}}>
        {renderHeader()}
        <ScrollView>
          {renderRestaurantDetails()}
          {renderFoodsByCategories()}
        </ScrollView>
      </View>
      {renderSearchModal()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  checkboxContainer:{
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.gray6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12
    
  },
  roundedCheckBoxContainer:{
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
  selectedCheckbox:{
      backgroundColor: COLORS.primary
  },
  checkboxText:{
      color: COLORS.white,
      fontSize: 16,
      fontFamily: 'regular'
  },
  starContainer:{
    height: 48,
    width: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.secondaryGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6
  }
})

export default RestaurantView1