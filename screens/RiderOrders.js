import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, icons } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { commonStyles } from '../styles/CommonStyles'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { FlatList } from 'react-native'
import { history, orders } from '../data/utils'
import { StatusBar } from 'expo-status-bar'
import { Feather, Ionicons, MaterialCommunityIcons, Fontisto, Octicons } from "@expo/vector-icons"
import GeneralService from '../services/general.service'
import AsyncStorage from '@react-native-async-storage/async-storage'

const OngoingRoute = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [ongoingData, setOngoingData] = useState([]);

  const navigate = useNavigation();
  var userId = 0;
  useEffect(() => {
    const fetchData = async () => {
      userId = await AsyncStorage.getItem("_id");
      getOrderOngoing(userId);
    }
    fetchData();
  }, [navigation]);

  const getOrderOngoing = async (id) => {
    try {
      setIsLoading(true);
      const ordersData = await GeneralService.listOngoingAssignedOrderByRiderId(id);
      const { data } = ordersData;
      const { response } = data;
      console.log(`ongoing-data=${JSON.stringify(response)}`);
      setIsLoading(false);
      setOngoingData(response);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setOngoingData([]);
    }
  }

  let result = <View style={{ flex: 1 }}>
    <FlatList
      data={ongoingData}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (
        <View style={{ flexDirection: 'column' }}>
          <View style={{
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 1,
            marginVertical: 12,
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
              // onPress={() => navigate.navigate("TrackingOrders", { orderId: item.id, orderNo: item.order_no, orderDate: item.created_at })}
              onPress={() => navigate.navigate("OrderDetail", { orderId: item.id })}
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

  </View>;

  return (
    result
  )
}


const HistoryRoute = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigation();

  var userId = 0;
  useEffect(() => {
    const fetchData = async () => {
      userId = await AsyncStorage.getItem("_id");
      getOrderHistory(userId);
    }
    fetchData();
  }, [navigation]);


  const getOrderHistory = async (id) => {
    try {
      setIsLoading(true);
      const ordersData = await GeneralService.listHistoryAssignedOrderByRiderId(id);
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
    historyData.length > 0 ? (
      <View style={{ flex: 1 }}>
        <FlatList
          data={historyData}
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
    ) : <View style={{ flex: 1 }}><Text>No data found</Text></View>;
  return (
    result
  )
}

const renderScene = SceneMap({
  first: OngoingRoute,
  second: HistoryRoute,
});

const RiderOrders = ({ navigation }) => {
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

    const handleLogout = async () => {
      try {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("_id");
        await AsyncStorage.removeItem("user_type");
        console.error('Cleared successfully:');

        navigation.replace('Login');
      } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
      }
    };

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.header1Icon}
          >
            <Image
              resizeMode='contain'
              source={icons.arrowLeft}
              style={{ height: 24, width: 24, tintColor: COLORS.black }}
            />
          </TouchableOpacity> */}
          <Text style={{ marginLeft: 12, fontSize: 17, fontFamily: 'regular' }}>Orders</Text>
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
            {/* <View style={{
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
            </View> */}
            <TouchableOpacity
              onPress={handleLogout}
            >
              <Feather name="log-out" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* TODO cart counter here */}
        {/* <TouchableOpacity
          onPress={() => console.log("Pressed")}
          style={commonStyles.header1Icon}
        >
          <Image
            resizeMode='contain'
            source={icons.more}
            style={{ height: 24, width: 24, tintColor: COLORS.black }}
          />
        </TouchableOpacity> */}

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

export default RiderOrders