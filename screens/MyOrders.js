import { View, Text, TouchableOpacity, Image, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, icons } from '../constants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { commonStyles } from '../styles/CommonStyles'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { FlatList } from 'react-native'
import { history, orders } from '../data/utils'
import { StatusBar } from 'expo-status-bar'
import { Feather, Ionicons, MaterialCommunityIcons, Fontisto, Octicons } from "@expo/vector-icons"
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OngoingRoute = ({ navigation, index }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [ongoingData, setOngoingData] = useState([]);

  const navigate = useNavigation();
  var userId = 0;

  useEffect(() => {
    fetchData();
  }, [index]);

  const fetchData = async () => {
    userId = await AsyncStorage.getItem("_id");
    getOrderOngoing(userId);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const getOrderOngoing = async (id) => {
    try {
      setIsLoading(true);
      const ordersData = await GeneralService.listOrdersByUserIdOngoing(id);
      const { data } = ordersData;
      const { response } = data;
      // console.log(`ongoing-data=${JSON.stringify(response)}`);
      setIsLoading(false);
      setOngoingData(response);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setOngoingData([]);
    }
  }

  // console.log(ongoingData.length);
  let result = (
    <View style={{ flex: 1, marginBottom: "20%" }}>
      <FlatList
        data={ongoingData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'column' }}>
            <View style={{
              borderBottomColor: COLORS.gray,
              borderBottomWidth: 1,
              marginVertical: 12,
              paddingBottom: 4,
            }}>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}>Order ID: {item.order_no}</Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4
                  }}>
                    <Text style={{ fontSize: 14, fontFamily: 'bold' }}>Rs. {item.bill}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'regular' }}> | {item.created_at}</Text>
                  </View>
                </View>
              </View>
              <Text style={{
                fontSize: 14,
                fontFamily: 'bold',
                color: item.status === "PENDING" ? COLORS.yellow :
                  (item.status === "DELIVERED" ? COLORS.green :
                    (item.status === "PACKING" ? COLORS.blue :
                      (item.status === "CANCELLED" ? COLORS.red : COLORS.blue)))
              }}>{item.status}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 18
            }}>
              <TouchableOpacity
                onPress={() => navigate.navigate("TrackingOrders", { orderId: item.id, orderStatus: item.status, orderNo: item.order_no, orderDate: item.created_at })}
                // onPress={() => navigate.navigate("TrackingOrders")}
                style={{
                  height: 38,
                  width: 140,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  borderRadius: 8
                }}
              >
                <Text style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontFamily: 'regular'
                }}>Track Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {/* Add padding to the bottom to accommodate bottom content */}
      {/* <View style={{ height: 100 }}></View> */}
    </View>
  );


  let response = ongoingData.length > 0 ? result : <View style={{ flex: 1 }}>
    <Text style={{
      color: COLORS.black,
      fontSize: 14,
      fontFamily: 'regular',
      textAlign: 'center'
    }}>No record found</Text></View>;

  response = isLoading ? <ActivityIndicator size="large" color="blue" /> : response;

  return (
    response
  )
}

const HistoryRoute = ({ navigation, index }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigation();

  var userId = 0;

  useEffect(() => {
    fetchData();
  }, [index]);


  const fetchData = async () => {
    userId = await AsyncStorage.getItem("_id");
    getOrderHistory(userId);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );


  const getOrderHistory = async (id) => {
    try {
      setIsLoading(true);
      const ordersData = await GeneralService.listOrdersByUserIdHistory(id);
      const { data } = ordersData;
      const { response } = data;
      console.log(`data=${JSON.stringify(response)}`);
      setIsLoading(false);
      setHistoryData(response);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setHistoryData([]);
    }
  }

  // const navigation = useNavigation();
  let result =

    <View style={{ flex: 1, marginBottom: "20%" }}>
      <FlatList
        data={historyData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'column' }}>
            <View style={{
              borderBottomColor: COLORS.gray,
              borderBottomWidth: 1,
              marginVertical: 12,
              flexDirection: 'row',
              paddingBottom: 4
            }}>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ marginLeft: 12 }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}>Order ID: {item.order_no}</Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 4
                  }}>
                    <Text style={{ fontSize: 14, fontFamily: 'bold' }}>Rs. {item.bill}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'regular' }}> | {item.created_at}</Text>
                  </View>
                </View>
              </View>
              <Text style={{
                fontSize: 14,
                color: item.status === "PENDING" ? COLORS.yellow :
                  (item.status === "DELIVERED" ? COLORS.green :
                    (item.status === "PACKING" ? COLORS.blue :
                      (item.status === "CANCELLED" ? COLORS.red : COLORS.blue))),
                fontFamily: 'bold'
              }}>{item.status}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 18
            }}>
              <TouchableOpacity
                onPress={() => navigate.navigate("OrderDetail", { orderId: item.id })}
                // onPress={() => navigation.navigate("OrderDetail")}
                style={{
                  height: 38,
                  width: 140,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.primary,
                  borderRadius: 8
                }}
              >
                <Text style={{
                  color: COLORS.white,
                  fontSize: 14,
                  fontFamily: 'regular'
                }}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>

  let response = historyData.length > 0 ? result : <View style={{ flex: 1 }}>
    <Text style={{
      color: COLORS.black,
      fontSize: 14,
      fontFamily: 'regular',
      textAlign: 'center'
    }}>No record found</Text></View>;

  response = isLoading ? <ActivityIndicator size="large" color="blue" /> : response;

  return (
    response
  )
}

const renderScene = SceneMap({
  first: OngoingRoute,
  second: HistoryRoute,
});

const MyOrders = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'first', title: 'Ongoing' },
    { key: 'second', title: 'History' },
  ])

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary
      }}
      style={{
        backgroundColor: '#fff',
      }}
      renderLabel={({ route, focused, color }) => (
        <Text style={[{ color: focused ? COLORS.black : 'gray' }]}>
          {route.title}
        </Text>
      )}
    />
  );
  const renderHeader = () => {
    const navigation = useNavigation()
    const [cartCounter, setCartCounter] = useState(0);

    const getCartCounter = async () => {
      try {
        let userId = await AsyncStorage.getItem("_id");
        const cartResponse = await GeneralService.cartCounterByUserId(userId);
        const { data: cartData } = cartResponse;
        // console.log(`home-data=${cartData}`);
        const { response: cartNo } = cartData;
        setCartCounter(cartNo);

      } catch (err) {
        console.log(err);
        setCartCounter(0);
      }
    }

    useFocusEffect(
      React.useCallback(() => {
        // const cartCounter = async () => {
        //   let cartCounter = await AsyncStorage.getItem("cart_counter");
        //   console.log(`cart-counter=${cartCounter}`);
        //   setCartCounter(cartCounter);
        // };

        getCartCounter();
      }, [])
    );

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 16
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
          <Text style={{ marginLeft: 12, fontSize: 17, fontFamily: 'regular' }}>My Orders</Text>
        </View>

        {/* <View style={{
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
        </View> */}
      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar hidden={true} />
      <View style={{ flex: 1 }}>
        {renderHeader()}
        <View style={{
          flex: 1,
          marginHorizontal: 22
        }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default MyOrders