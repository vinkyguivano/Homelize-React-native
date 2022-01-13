import React, { useState, useEffect, useContext } from 'react'
import { Button, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, TouchableNativeFeedback, Alert, View } from 'react-native'
import * as Container from '../../../components/Container'
import { Main as Text } from '../../../components/Text'
import AuthContext from '../../../context/AuthContext'
import { api, capitalize, color, rupiahFormat } from '../../../utils'
import Loading from '../../../components/Loading'
import { showMessage } from 'react-native-flash-message'
import moment from 'moment'
import * as Modal from '../../../components/Modal'

const { width, height } = Dimensions.get('window')

const OrderDetail = ({ navigation, route: { params } }) => {
  const { user: { user, token } } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const { orderId } = params
  const paymentImage = order.payment_images?.slice(-1)[0];

  const fetchOrderData = async () => {
    try {
      const { data } = await api.get(`orders/${orderId}`, token)
      setOrder(data)
    } catch (error) {
      showMessage({
        message: 'Error ' + error,
        type: 'danger'
      })
    }
  }

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      await fetchOrderData()
      setLoading(false)
    }

    fetch()
  }, [])

  const onRefresh = async () => {
    setRefresh(true)
    await fetchOrderData()
    setRefresh(false)
  }

  const onPressImage = (uri) => {
    navigation.navigate("Photo", {
      from: 'Order Detail',
      data: { uri }
    })
  }

  const onRejectPaymentConfirmation = () => {
    Alert.alert("Alert", "Apakah anda yakin bukti pembayaran belum sesuai?", [
      {
        text: 'Tidak'
      },
      {
        text: 'Ya',
        onPress: () => handleUpdateOrder({type: 4})
      }
    ], { cancelable: true })
  }

  const handleUpdateOrder = async (params, body={}) => {
    try {
      await api.post(`orders/${orderId}/update`, token, body, params );
      await fetchOrderData()
    } catch (error) {
      showMessage({
        message: 'Error '+error,
        type: 'danger'
      })
    }
  }

  const renderArchitectOrder = (
    <View>
      <View style={styles.rowItem}>
        <Text>Jenis Paket:</Text>
        <Text>{order.detail?.package_name}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>Gaya desain:</Text>
        <Text>{order.detail?.style_name}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>Ukuran tanah: </Text>
        <Text>{order.detail?.land_length} x {order.detail?.land_width}</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>Luas bangunan: </Text>
        <Text>{order.detail?.building_area} m²</Text>
      </View>
      <View style={styles.rowItem}>
        <Text>Jumlah lantai: </Text>
        <Text>{order.detail?.floor_count}</Text>
      </View>
      {
        order.detail?.rooms && (
          order.detail.rooms.map((item, idx) => (
            <View style={styles.rowItem} key={idx}>
              <Text>Jumlah {item.name}: </Text>
              <Text>{item.quantity}</Text>
            </View>
          ))
        )
      }
      <View style={styles.rowItem}>
        <Text>Budget yang dimiliki: </Text>
        <Text>Rp. {rupiahFormat(order.detail?.budget_estimation || '-')}</Text>
      </View>
      {
        order.detail?.note && (
          <View style={styles.rowItem}>
            <Text>Catatan: </Text>
            <Text>{order.detail?.note}</Text>
          </View>
        )
      }
      {
        order.detail?.images && (
          <View style={{ marginVertical: 8, marginRight: -20 }}>
            <Text marginBottom={8}>Gambar Pendukung :</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {order.detail.images.map((item, index) => (
                <TouchableNativeFeedback onPress={() => onPressImage(item.image_path)} key={index}>
                  <View style={{ marginRight: 12 }} >
                    <Image
                      source={{ uri: item.image_path }}
                      style={styles.image} />
                    <Text marginTop={5}>{item.description}</Text>
                  </View>
                </TouchableNativeFeedback>
              ))}
            </ScrollView>
          </View>
        )
      }
    </View>
  )

  const renderInteriorOrder = (
    <View>
      {Array.isArray(order.detail) && (
        order.detail.map((item, index) => (
          <View key={index} style={styles.roomContainer}>
            <Text fontWeight={'bold'}>Ruangan {index + 1}</Text>
            <View style={styles.rowItem}>
              <Text>Kategori : </Text>
              <Text>{item.room_category}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text>Gaya desain : </Text>
              <Text>{item.style_name}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text>Ukuran ruangan : </Text>
              <Text>{item.room_width} x {item.room_length}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text>Luas ruangan : </Text>
              <Text>{item.room_area} m²</Text>
            </View>
            {
              item.note && (
                <View style={{ marginVertical: 8 }}>
                  <Text>Catatan : </Text>
                  <Text>{item.note}</Text>
                </View>
              )
            }
            {
              item.images && (
                <View style={{ marginVertical: 8, marginRight: -20 }}>
                  <Text marginBottom={8}>Gambar Pendukung :</Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {item.images.map((item2, index) => (
                      <TouchableNativeFeedback onPress={() => onPressImage(item2.image_path)} key={index}>
                        <View style={{ marginRight: 12 }} >
                          <Image
                            source={{ uri: item2.image_path }}
                            style={styles.image} />
                          <Text marginTop={5}>{item2.description}</Text>
                        </View>
                      </TouchableNativeFeedback>
                    ))}
                  </ScrollView>
                </View>
              )
            }
          </View>
        )))}
    </View>
  )

  if (loading) return <Loading />

  return (
    <>
      <Container.Scroll
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh} />
        }>
        <View>
          <View style={{ ...styles.rowItem, marginTop: 0 }}>
            <Text>Status Pesanan : </Text>
            <Text>{capitalize(order.status?.name.toLowerCase() || '')}</Text>
          </View>
          <View style={{ marginVertical: 8 }}>
            {
              order.status?.id === 2 ?
                <View>
                  <Text fontWeight={'bold'}>Segera konfirmasi bukti pembayaran dari klien anda!</Text>
                  <View style={styles.paymentSSContainer}>
                    <TouchableNativeFeedback onPress={() => onPressImage(paymentImage?.image_path)}>
                      <Image
                        source={{ uri: paymentImage?.image_path }}
                        style={styles.paymentImage} />
                    </TouchableNativeFeedback>
                  </View>
                </View>
                : order.status?.id === 3 ?
                  <View></View>
                  : order.status?.id === 4 ?
                    <View></View>
                    : null
            }
          </View>
        </View>
        <View style={styles.greyBar} />
        <View style={{ marginVertical: 8 }}>
          <Text style={styles.orderTitle}>Informasi Pesanan</Text>
          <View style={styles.rowItem}>
            <Text>Nama Pemesan : </Text>
            <Text>{order.client_name}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text>Nomor HP / WA : </Text>
            <Text>{order.client_phone_number}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text>Tanggal Pesanan : </Text>
            <Text>{moment(order.created_at).format('DD MMM YYYY')}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text>Harga Pesanan : </Text>
            <Text>Rp. {rupiahFormat(order.price || '-')}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text>Kategori Pesanan : </Text>
            <Text>{order.type?.name}</Text>
          </View>
        </View>
        <View style={styles.greyBar} />
        <View style={{ marginTop: 8, marginBottom: 16 }}>
          <Text style={{ ...styles.orderTitle, fontSize: 14 }}>
            Detail Pesanan
          </Text>
          {
            order.type?.id === 1 ?
              renderArchitectOrder : renderInteriorOrder
          }
        </View>
      </Container.Scroll>
      <View style={styles.buttonContainer}>
        {
          order.status?.id === 2 ?
            <Container.row justifyContent={'space-between'}>
              <View style={{ flex: .47 }}>
                <Button
                  title='Accept'
                  color={'#008000'}
                  onPress={() => handleUpdateOrder({type: 3})} />
              </View>
              <View style={{ flex: .47 }}>
                <Button
                  title='Reject'
                  color={color.red}
                  onPress={onRejectPaymentConfirmation} />
              </View>
            </Container.row>
            : order.status?.id === 3 ?
              <View></View>
              : null
        }
      </View>
      <Modal.Loading1 isVisible={isSubmit} />
    </>
  )
}

export default OrderDetail

const styles = StyleSheet.create({
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 11
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  greyBar: {
    height: 1,
    backgroundColor: 'lightgrey',
  },
  image: {
    aspectRatio: 1.4,
    width: 200
  },
  roomContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    marginBottom: 8,
    paddingBottom: 8
  },
  paymentSSContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paymentImage: {
    width: width * (150 / width),
    aspectRatio: 1
  },
  buttonContainer: {
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000000',
    padding: 14
  }
})
