import React, { useState, useEffect, useContext } from 'react'
import { Button, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, TouchableNativeFeedback, Alert, View, BackHandler, TouchableWithoutFeedback, Platform, PermissionsAndroid } from 'react-native'
import * as Container from '../../../components/Container'
import { Main as Text } from '../../../components/Text'
import AuthContext from '../../../context/AuthContext'
import { api, capitalize, color, rupiahFormat } from '../../../utils'
import Loading from '../../../components/Loading'
import { showMessage } from 'react-native-flash-message'
import moment from 'moment'
import * as Modal from '../../../components/Modal'
import { PrimaryButton } from '../../../components/Button'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNFetchBlob from 'rn-fetch-blob'

const { width, height } = Dimensions.get('window')

const OrderDetail = ({ navigation, route: { params } }) => {
  const { user: { user, token } } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const { orderId } = params
  const [isUpdateProgressModalOpen, setUpdateProgressModalOpen] = useState(false)
  const [isOrderDetailModalOpen, setOrderDetailModalOpen] = useState(false)
  const [isFinishOrderModalOpen, setFinishOrderModalOpen] = useState(false)
  const paymentImage = order.payment_images?.slice(-1)[0];
  const downloadUrl = 'http://localhost:8000/download/'

  const backAction = () => {
    navigation.goBack(),
      params.onGoBack?.()
    return true
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableNativeFeedback onPress={backAction}>
          <View style={{ marginRight: 24 }}>
            <Icon name="arrow-left" color={'black'} size={24} />
          </View>
        </TouchableNativeFeedback>
      )
    })
    BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction)
    }
  }, [])


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
    setOrderDetailModalOpen(false)
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
        onPress: () => handleUpdateOrder({ type: 4 })
      }
    ], { cancelable: true })
  }

  const handleUpdateOrder = async (params, body = {}) => {
    try {
      setLoading(true)
      await api.post(`orders/${orderId}/update`, token, body, params);
      await fetchOrderData()
      setLoading(false)
    } catch (error) {
      showMessage({
        message: 'Error ' + error,
        type: 'danger'
      })
    }
  }

  const toggleUpdateProgressModal = () => {
    setUpdateProgressModalOpen(!isUpdateProgressModalOpen)
  }

  const toggleOrderDetailModal = () => {
    setOrderDetailModalOpen(!isOrderDetailModalOpen)
  }

  const toggleFinishOrderModal = () => {
    setFinishOrderModalOpen(!isFinishOrderModalOpen)
  }

  const onPressChat = () => {
    navigation.navigate("Chat Room", {
      name: order.user?.name,
      id: order.user?.id,
      to: "client",
      image_path: order.user?.profile_pic,
    })
  }

  const onUpdateProgressSubmit = async (status, file) => {
    const formData = new FormData()
    formData.append('current_update', status)
    if (file) {
      formData.append('file', {
        name: file.name,
        type: file.type,
        uri: file.uri
      })
    }
    try {
      setIsSubmit(true)
      await api.post(`orders/${orderId}/update-progress`, token, formData, {}, {
        'Content-Type': 'multipart/form-data'
      })
      await fetchOrderData()
      setIsSubmit(false)
      setUpdateProgressModalOpen(false)
      showMessage({
        message: "Updated Successfully",
        type: 'success'
      })
    } catch (error) {
      showMessage({
        message: 'Error ' + error,
        type: 'danger'
      })
    }
  }

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
  };

  const checkPermission =  async (filename) => {
    if(Platform.OS === 'ios'){
      onDownloadClick(filename)
    }else{
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission required',
            message: 'Application needs access to your storage to download file'
          }
        )

        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          onDownloadClick(filename)
        }else{
          showMessage({
            message: 'Storage permission not granted',
            type: 'danger'
          })
        }
      } catch (e){
        showMessage({
          message: 'error ' + e,
          type: 'danger'
        })
      }
    }
  }

  const onDownloadClick = async (filename) => {
    let date = new Date()
    let fileURL = downloadUrl + filename
    let fileExt = '.' + getFileExtention(fileURL)[0]
    const { config, fs} = RNFetchBlob
    let RootDir = fs.dirs.DownloadDir
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        description: 'downloading file..',
        path: RootDir + '/file_'+ Math.floor(date.getTime() + date.getSeconds() / 2) + fileExt
      }
    }

    config(options).fetch('GET', fileURL).then(res => {
      console.log('res ' + JSON.stringify(res))
    }) 
  }

  const onFinishOrder = (link) => {
    const params ={
      type: 5,
      link: link
    }
    setFinishOrderModalOpen(false)
    handleUpdateOrder(params)    
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
          <View style={{ marginVertical: 8, marginRight: -15 }}>
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

  const renderOrderProgress = (order.order_progress && order.order_progress.length > 0) && (
    <View>
      { order.order_progress.map((item, index, self) => (
        <View key={index}>
          <View style={styles.progressContainer}>
            <View style={{flex: .3, marginLeft: 8}}>
              <View style={{flex: 1, alignSelf: 'flex-start'}}>
                <Icon 
                  name="circle-slice-8" 
                  size={24} 
                  color={index === 0 ? color.primary: 'lightgrey'}
                  style={styles.circleIcon}/>
                <View style={{ 
                    flex: index === self.length - 1 ? 0 : 1 , 
                    backgroundColor: index === 0 ? color.primary : 'lightgrey', 
                    alignSelf: 'center', 
                    width: 2}}/>
              </View>
            </View>
            <View style={{flex: 1, marginBottom: 13}}>
              <Text fontWeight={'bold'} fontSize={14}>{item.name} - {`${moment(item.created_at).format('DD/MM/YY')}`}</Text>
              {
                item.link ? (
                  <View>
                    <Text>Kamu dapat melihatnya dengan menekan tombol ini.{` `}  
                      <TouchableWithoutFeedback onPress={()=>checkPermission(item.link)}>
                        <Icon name="download" size={20}/>
                      </TouchableWithoutFeedback>
                    </Text>
                  </View>
                ) : item.description ? (
                  <View>
                    <Text>{item.description}</Text>
                  </View>
                ) : null
              }
            </View>
          </View>
        </View>
      ))}
    </View>
  )

  if (loading) return <Loading />

  return (
    <View style={{ flex: 1 }}>
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
                : (order.status?.id === 3 || order.status?.id === 4 || order.status?.id === 5) ?
                  <View>
                    {renderOrderProgress}
                  </View>
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
        <View style={{ alignSelf: 'center' }}>
          <PrimaryButton
            title={"Lihat Detail"}
            height={'auto'}
            padding={10}
            width={150}
            fontStyle={{
              fontSize: 15
            }}
            onPress={toggleOrderDetailModal}
            marginBottom={16} />
        </View>
        <View style={styles.greyBar} />
        {(order.status?.id === 2 || order.status?.id === 3 || order.status?.id === 4) &&
          <TouchableNativeFeedback onPress={onPressChat}>
            <View style={styles.buttonChatContainer}>
              <Icon name="message-text" size={24} color={'white'} />
              <Text marginLeft={8} color={'white'} fontWeight={'bold'}>Chat Client</Text>
            </View>
          </TouchableNativeFeedback>
        }
        <View style={{marginBottom: 16}}/>
      </Container.Scroll>
      {(order.status?.id === 2 || order.status?.id === 3) &&
        <View style={styles.buttonContainer}>
          <Container.row justifyContent={'space-between'}>
            {
              order.status?.id === 2 ?
                <>
                  <View style={{ flex: .47 }}>
                    <Button
                      title='Accept'
                      color={'#008000'}
                      onPress={() => handleUpdateOrder({ type: 3 })} />
                  </View>
                  <View style={{ flex: .47 }}>
                    <Button
                      title='Reject'
                      color={color.red}
                      onPress={onRejectPaymentConfirmation} />
                  </View>
                </>
                : order.status?.id === 3 ?
                  <>
                    <View style={{ flex: .5 }}>
                      <Button
                        title='Update Progress'
                        color={'#008000'}
                        onPress={toggleUpdateProgressModal} />
                    </View>
                    <View style={{ flex: .45 }}>
                      <Button
                        disabled={!order.order_progress || order.order_progress?.length < 3}
                        title='SELESAI'
                        color={'#008000'}
                        onPress={toggleFinishOrderModal} />
                  </View>
                  </>
                  : null
            }
          </Container.row>
        </View>
      }
      <Modal.UpdateProgress
        isVisible={isUpdateProgressModalOpen}
        toggleModal={toggleUpdateProgressModal}
        onSubmit={onUpdateProgressSubmit} />
      <Modal.OrderDetail
        isVisible={isOrderDetailModalOpen}
        toggleModal={toggleOrderDetailModal}
        renderContent={order.type?.id === 1 ?
          renderArchitectOrder : renderInteriorOrder} />
      <Modal.FinishOrder
         isVisible={isFinishOrderModalOpen}
         toggleModal={toggleFinishOrderModal}
         onSubmit={onFinishOrder}
      />
      <Modal.Loading1 isVisible={isSubmit} />
    </View>
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
    padding: 14,
    marginTop: 'auto'
  },
  buttonChatContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
    marginTop: 20,
    padding: 9,
    borderRadius: 5,
    marginBottom: 16
  },
  progressContainer: {
    flexDirection: 'row'
  },
})
