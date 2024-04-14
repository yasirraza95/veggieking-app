import { View, StyleSheet,Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../constants'
import { ScrollView } from 'react-native-virtualized-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TransactionHistoryData } from '../data/utils'
import Header from '../components/Header'
import OrdDtlCard from '../components/OrdDtlCard'
import GeneralService from '../services/general.service'

const OrderDetail = ({ route, navigation }) => {

  const { orderId } = route.params;
  console.log(orderId);
  const [isLoading, setIsLoading] = useState(false)
  const [detailData, setDetailData] = useState([]);

  useEffect(() => {
    const getOrderDetail = async (id) => {
      try {
        setIsLoading(true);
        const ordersData = await GeneralService.listOrdersDetailByOrderId(id);
        const { data } = ordersData;
        const { response } = data;
        console.log(`detail-data=${JSON.stringify(response)}`);
        setIsLoading(false);
        setDetailData(response);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setDetailData([]);
      }
    }

    getOrderDetail(orderId);
  }, [orderId, navigation]);

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        <Header title="Order Detail" />
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>Order Detail</Text>
</View> */}


        <ScrollView>
          <FlatList
            data={detailData}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <OrdDtlCard
                image={item.prod_image}
                amount={item.prod_price}
                type={item.type}
                price={item.price}
                date={item.date}
                name={item.prod_name}
                quantity={item.quantity}
                totalAmt={item.order_amount}
              />
            )}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
    alignItems: "center"
  },
  headerIcon: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: COLORS.gray
  },
  arrowLeft: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  moreIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.black
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.black
  },
})

export default OrderDetail