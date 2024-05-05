import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images, icons, SIZES, COLORS, FONTS, illustrations } from '../constants'
import { orderList } from '../data/utils'
import { TouchableOpacity } from 'react-native'
import RBSheet from "react-native-raw-bottom-sheet"
import { Feather, FontAwesome5 } from "@expo/vector-icons"
import VerticalStepper from '../components/VerticalStepper'
import { StatusBar } from 'expo-status-bar'
import GeneralService from '../services/general.service'
import { ScrollView } from 'react-native-virtualized-view'

// TODO
const TrackingOrderV3 = ({ route, navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const { orderId, orderNo, orderDate, orderStatus } = route.params;

  useEffect(() => {
    getOrderDetailById(orderId);
  }, [navigation]);

  const getOrderDetailById = async (id) => {
    try {
      setIsLoading(true);
      const ordersData = await GeneralService.listOrdersDetailByOrderId(id);
      const { data } = ordersData;
      const { response } = data;
      // console.log(`tracking=${JSON.stringify(response)}`);
      setIsLoading(false);
      setData(response);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      setData([]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <View style={{
        position: 'absolute',
        marginHorizontal: 16,
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        top: 22,
        zIndex: 999
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 45,
            width: 45,
            borderRadius: 22.5,
            backgroundColor: COLORS.black,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            zIndex: 9999
          }}
        >
          <Image
            source={icons.arrowLeft}
            resizeMode="contain"
            style={{
              height: 24,
              width: 24,
              tintColor: COLORS.white
            }}
          />
        </TouchableOpacity>
        <Text style={{ ...FONTS.body3 }}>Track Order</Text>
      </View>

      <View style={{
        width: SIZES.width - 32,
        marginHorizontal: 16,
        top: 90,
      }}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View
            style={{ flexDirection: 'row' }}
          >
            <View style={{
              marginRight: 12
            }}>
            </View>
            <View style={{
              flexDirection: 'column',
            }}>
              <Text style={{ ...FONTS.h4 }}>{orderNo}</Text>
              <Text style={styles.body3}>Orderd at {orderDate}</Text>
              {data.map((res) => {
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.h3}>{res.quantity}x</Text>
                    <Text style={styles.body3}>{res.prod_name}</Text>
                  </View>
                )
              })}

            </View>
          </View>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 22
          }}>
          </View>

          <VerticalStepper status={orderStatus} />

          <Image
            // source={illustrations.deliverd}
            // source={illustrations.packing}
            source={orderStatus === "PENDING" ? illustrations.received :
              (orderStatus === "DELIVERED" ? illustrations.deliverd :
                (orderStatus === "PACKING" ? illustrations.packing :
                  (orderStatus === "CANCELLED" ? COLORS.red : illustrations.deliverd)))}
            style={[styles.locationImage, { alignSelf: 'center' }]}
          />

        </ScrollView>

      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // Callout bubble
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 'auto',
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  body3: {
    fontSize: 12,
    color: COLORS.gray5,
    marginVertical: 3,
  },
  h3: {
    fontSize: 12,
    color: COLORS.gray5,
    marginVertical: 3,
    fontFamily: 'bold',
    marginRight: 6
  },
  btn1: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn2: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: COLORS.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationImage: {
    height: SIZES.width * 0.7,
    width: SIZES.width * 0.7,
  },
})

export default TrackingOrderV3