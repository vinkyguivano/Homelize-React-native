import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, TouchableNativeFeedback, BackHandler, View, TouchableWithoutFeedback, Platform, PermissionsAndroid, Button, Alert, Linking, TouchableOpacity } from 'react-native'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import AuthContext from '../../../../context/AuthContext'
import { api, capitalize, color, rupiahFormat } from '../../../../utils'
import Loading from '../../../../components/Loading'
import { showMessage } from 'react-native-flash-message'
import moment from 'moment'
import { PrimaryButton } from '../../../../components/Button'
import * as Modal from '../../../../components/Modal'
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
  const paymentImage = order.payment_images?.[0];
  const [isOrderDetailModalOpen, setOrderDetailModalOpen] = useState(false)
  const [isComplaintModalVisible, setComplaintModalVisible] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState('')
  const [isComplaintModalDetailOpen, setComplaintDetailModalOpen] = useState(false)
  const downloadUrl = 'http://prod.eba-dcjmmfsy.ap-southeast-1.elasticbeanstalk.com/download/'

  const backAction = () => {
    navigation.goBack(),
    params.onGoBack?.()
    return true
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableNativeFeedback onPress={backAction}>
          <View style={{marginRight: 24}}>
            <Icon name="arrow-left" color={'black'} size={24}/>
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

  const toggleOrderDetailModal = () => {
    setOrderDetailModalOpen(!isOrderDetailModalOpen)
  }

  const onPressChat = () => {
    navigation.navigate("Chat Room", {
      name: order.professional?.name,
      id: order.professional?.id,
      to: "professional",
      image_path: order.professional?.profile_pic,
    })
  }

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

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ?
             /[^.]+$/.exec(fileUrl) : undefined;
  };

  const onDownloadClick = async (filename) => {
    let date = new Date()
    let fileURL = downloadUrl + filename
    let fileExt = "." + getFileExtention(fileURL)[0]
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

  const onCompleteOrder = () => {
    Alert.alert('Konfirmasi', 'Apakah anda yakin bahwa pesanan anda telah sesuai ?', [
      {
        text: 'Ya',
        onPress: handleCompleteOrder
      },
      {
        text: 'Tidak'
      }
    ], { cancelable: true})
  }

  const handleCompleteOrder = async () => {
    try {
      setLoading(true)
      await api.post(`orders/${orderId}/update`, token, {} , { type: 6});
      await fetchOrderData()
      setLoading(false)
    } catch (error) {
      showMessage({
        message: 'Error ' + error,
        type: 'danger'
      })
    }
  }

  const onRatingButtonPress = () => {
    navigation.navigate('Rating', {
      orderId: orderId,
      rate: order.rate,
      review: order.review,
      profile_pic: order.professional?.profile_pic,
      prof_name: order.professional?.name,
      onGoBack: () => fetchOrderData()
    })
  }

  const toggleComplaintModal = () => {
    setComplaintModalVisible(!isComplaintModalVisible)
  }

  const onComplaintSubmit = async (title, desc, photo) => {
    try {
      setIsSubmit(true)
      let data = new FormData()
      data.append('title', title)
      data.append('description', desc)
      data.append('image', {
        name: photo.fileName,
        type: photo.type,
        uri: Platform.OS === 'ios' ?
        photo.uri.replace('file://', '')
        : photo.uri
      })

      await api.post(`orders/${orderId}/update`, token, data , { type: 7}, {
        'Content-Type': 'multipart/formdata'
      });
      await fetchOrderData()
      toggleComplaintModal()
      setIsSubmit(false)
    } catch (error) {
      console.log(error.response.data)
      showMessage({
        message: 'Error ' + error,
        type: 'danger'
      })
      setIsSubmit(false)
    }
  }

  const openDetailComplaint = (complaintId) => {
    const complaint = order.order_complaints.find((item) => item.id === complaintId)
    if(complaint){
      setComplaintDetailModalOpen(true)
      setSelectedComplaint(complaint)
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
                <View style={{ marginVertical: 8, marginRight: -15 }}>
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
                        <Icon name="download" size={25} color={'black'}/>
                      </TouchableWithoutFeedback>
                    </Text>
                  </View>
                ) : item.url ? (
                  <View>
                    <Text>
                      {item.description.split(' ').slice(0, -1).join(' ')}
                      {` `}
                      <Text onPress={() => Linking.openURL(item.url)} color={'blue'}>
                        {item.url}
                      </Text>
                    </Text>
                  </View>
                ) : 
                item.description ? (
                  <View>
                    <Text>{item.description}</Text>
                  </View>
                ) : item.complaint_id ? (
                  <View>
                    <Text onPress={() => openDetailComplaint(item.complaint_id)}>
                      {'Lihat detail komplain >'}
                    </Text>
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
    <View style={{flex: 1}}>
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
                  <Text fontWeight={'bold'}>Professional sedang memverifikasi pembayaran anda!</Text>
                  <View style={styles.paymentSSContainer}>
                    <TouchableNativeFeedback onPress={() => onPressImage(paymentImage?.image_path)}>
                      <Image
                        source={{ uri: paymentImage?.image_path }}
                        style={styles.paymentImage} />
                    </TouchableNativeFeedback>
                  </View>
                </View>
                : (order.status?.id === 3 || order.status?.id === 4 || order.status?.id === 5 || order.status?.id === 7) ?
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
            <Text>Nama Professional : </Text>
            <Text>{order.professional?.name}</Text>
          </View>
          <View style={styles.rowItem}>
            <Text>Email Professional : </Text>
            <Text>{order.professional?.email}</Text>
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
        <View style={{alignSelf: 'center'}}>
          <PrimaryButton 
            title={"Lihat Detail"}
            height={'auto'}
            padding={10}
            width={150}
            fontStyle={{
              fontSize: 15
            }}
            onPress={toggleOrderDetailModal}
            marginBottom={16}/>
        </View>
        <View style={styles.greyBar} />
        { (order.status?.id === 2 || order.status?.id === 3 || order.status?.id === 4 || order.status?.id === 7) &&
          <TouchableNativeFeedback onPress={onPressChat}>
            <View style={styles.buttonChatContainer}>
              <Icon name="message-text" size={24} color={'white'} />
              <Text marginLeft={8} color={'white'} fontWeight={'bold'}>Chat Professional</Text>
            </View>
          </TouchableNativeFeedback> 
        }
        <View style={{marginBottom: 16}}/>
      </Container.Scroll>
      { (order.status?.id === 4 || order.status?.id === 5) && 
          <View style={styles.buttonContainer}>
          { order.status?.id === 4 ? (
              <>
                <Container.row justifyContent={'space-between'}>
                  <View style={{flex: .47}}>
                    <Button 
                      title='Selesai'
                      color={'#008000'}
                      onPress={onCompleteOrder}/>
                  </View>
                  <View style={{flex: .47}}>
                    <Button 
                      title='Ajukan Komplain'
                      color={color.red}
                      onPress={toggleComplaintModal}/>
                  </View>
                </Container.row>
              </>
            ) : order.status?.id === 5 ? (
              <>
                <Button 
                  title={`${order?.rate ? 'Lihat' : 'Beri'} ulasan`}
                  color={'#008000'}
                  onPress={onRatingButtonPress}/>
              </> 
            ) : null
          }
          </View>
      }
      <Modal.OrderDetail 
        isVisible={isOrderDetailModalOpen}
        toggleModal={toggleOrderDetailModal}
        renderContent={ order.type?.id === 1 ?
          renderArchitectOrder : renderInteriorOrder}/>
      <Modal.Complaint 
        isVisible={isComplaintModalVisible}
        toggleModal={toggleComplaintModal}
        onSubmit={onComplaintSubmit}/>
      <Modal.ComplaintDetail
        isVisible={isComplaintModalDetailOpen}
        toggleModal={() => setComplaintDetailModalOpen(!isComplaintModalDetailOpen)}
        content={selectedComplaint} 
      />
      <Modal.Loading1 
        isVisible={isSubmit}/>
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

