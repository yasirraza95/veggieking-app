import { View, Image, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons } from '../constants';
import { commonStyles } from '../styles/CommonStyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { StatusBar } from 'expo-status-bar';
import GeneralService from '../services/general.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../context/CartContext';
import ContentLoader from 'react-native-easy-content-loader'; // Import ContentLoader

const FoodDetailsV1 = ({ route }) => {
  const { stock, id: prodId, name, description, image, price, max_qty } = route.params;
  const { decreaseQty, cartItems, addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [cartCounter, setCartCounter] = useState(0);
  const [screenLoading, setScreenLoading] = useState(true); // Initialize loading state
  const [isFavourite, setIsFavourite] = useState(false);

  const navigation = useNavigation();

  const product = useMemo(() => ({
    stock, 
  }), [stock]);

  // Fetch cart data for the product
  const fetchData = useCallback(async (id) => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      const { data } = await GeneralService.getProductCartById(id, userId);
      setQuantity(data.response || 0);
    } catch (err) {
      setQuantity(0);
    } finally {
      setScreenLoading(false); // Set loading to false after fetching
    }
  }, []);

  // Fetch total cart counter
  const getCartCounter = useCallback(async () => {
    try {
      let userId = await AsyncStorage.getItem("_id");
      const { data } = await GeneralService.cartCounterByUserId(userId);
      setCartCounter(data.response || 0);
    } catch (err) {
      setCartCounter(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(prodId);
      getCartCounter();
    }, [fetchData, getCartCounter, prodId])
  );

  const handleQuantityChange = (newQuantity) => setQuantity(newQuantity);

  const getQuantityInCart = useMemo(() => {
    const item = cartItems.find(i => i.id === prodId);
    return item ? item.quantity : 0;
  }, [cartItems, prodId]);

  const decreaseQuantity = useCallback(() => {
    decreaseQty(product);
  }, [decreaseQty, product]);

  const cartAddition = useCallback(() => {
    let addedQty = getQuantityInCart;
    if (parseInt(addedQty) < parseInt(product.max_qty)) {
      addItemToCart(product);
    }
  }, [addItemToCart, getQuantityInCart, product]);

  // Render Header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.header1Icon}>
          <Image resizeMode='contain' source={icons.arrowLeft} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
      </View>
    </View>
  );

  // Render Food Details
  const renderFoodDetails = () => (
    <View style={styles.foodDetailsContainer}>
      <View>
        <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)} style={styles.favouriteIconContainer}>
          <Ionicons name={isFavourite ? "heart-sharp" : "heart-outline"} size={24} color={isFavourite ? COLORS.primary : COLORS.white} />
        </TouchableOpacity>
        <Image source={{ uri: `https://api.veggieking.pk/public/upload/${image}` }} resizeMode='contain' style={styles.foodImage} />
      </View>
      <View style={styles.foodTextContainer}>
        <View style={styles.foodTitleContainer}>
          <Text style={styles.foodName}>{name}</Text>
          <Text style={styles.foodPrice}>Rs. {price}</Text>
        </View>
        <Text style={styles.descriptionTitle}>Description</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.foodDescription}>{description}</Text>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.contentContainer}>
        {renderHeader()}

        {/* Conditionally render loader or food details */}
        {screenLoading ? (
          <ContentLoader 
            active
            pRows={3} // Set the number of rows for text lines
            pWidth={["100%", "90%", "80%"]} // Set variable widths for text lines
            pHeight={[10, 10, 10]} // Set uniform height for the text lines
            primaryColor="#f0f0f0" 
            secondaryColor="#e0e0e0" 
            animationDuration={2000}
            style={styles.loader}
          >
            {/* Loader for circular avatar */}
            <View style={styles.loaderAvatar} />
            {/* Loader for large image */}
            <View style={styles.loaderImage} />
          </ContentLoader>
        ) : (
          <>
            {renderFoodDetails()}
            <View style={styles.addToCartContainer}>
              {stock === 'in' ? (
                <View style={styles.cartBox}>
                  {getQuantityInCart > 0 ? (
                    <View style={quantityStyle.container}>
                      <TouchableOpacity onPress={decreaseQuantity} style={quantityStyle.button}>
                        <Text style={quantityStyle.buttonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={quantityStyle.quantity}>{getQuantityInCart}</Text>
                      <TouchableOpacity onPress={cartAddition} style={quantityStyle.button}>
                        <Text style={quantityStyle.buttonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Button filled onPress={cartAddition} isEnable={true} title={`ADD TO CART`} />
                  )}
                </View>
              ) : (
                <View style={styles.outOfStockContainer}>
                  <Ionicons name="alert-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  loader: {
    width: '100%', 
    height: 400, // Make loader large for prominent image loading
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loaderAvatar: {
    width: 60, 
    height: 60, 
    borderRadius: 30, // Circle shape for avatar or DP loader
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  loaderImage: {
    width: '100%', 
    height: 250, // Large image loader similar to product images
    borderRadius: 16, 
    backgroundColor: '#f0f0f0',
  },
  outOfStockContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.red, 
    padding: 10, 
    borderRadius: 12, 
    marginVertical: 15 
  },
  outOfStockText: {
    color: COLORS.white, 
    fontSize: 16, 
    fontFamily: 'bold', 
    textAlign: 'center'
  },
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  contentContainer: { flex: 1, paddingHorizontal: 16 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  arrowIcon: { height: 24, width: 24, tintColor: COLORS.primary },
  headerTitle: { fontSize: 18, color: COLORS.black, fontFamily: 'bold', marginLeft: 16 },
  foodDetailsContainer: { marginTop: 20 },
  foodImage: { width: '100%', height: 250, borderRadius: 16 },
  foodTextContainer: { marginVertical: 16 },
  foodName: { fontSize: 24, fontFamily: 'bold', color: COLORS.black },
  foodPrice: { fontSize: 20, fontFamily: 'bold', color: COLORS.primary },
  foodDescription: { fontSize: 14, color: COLORS.darkGray },
  favouriteIconContainer: { position: 'absolute', top: 12, right: 12, zIndex: 2 },
  addToCartContainer: { marginVertical: 16 },
  cartBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  descriptionTitle: { fontSize: 18, fontFamily: 'bold', color: COLORS.black },
});

export default FoodDetailsV1;
