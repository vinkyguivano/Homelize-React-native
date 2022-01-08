import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import * as Container from '../../../components/Container'
import * as Text from '../../../components/Text'
import { StyleSheet, View, ScrollView, Image, ToastAndroid, TouchableNativeFeedback, Button, Alert, Platform } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import Loading from '../../../components/Loading'
import * as Modal from '../../../components/Modal'
import { BCAIcon, InteriorIcon, ExteIcon } from '../../../assets'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AuthContext from '../../../context/AuthContext'
import { api, color, rupiahFormat, transferSteps } from '../../../utils'
import moment from 'moment'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Clipboard from '@react-native-clipboard/clipboard';

const OrderPayment = ({ navigation, route }) => {
  const orderId = route.params?.oid
  const { user } = useContext(AuthContext)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false)
  const [showDetail, setShowDetail] = useState(false);
  const [image, setImage] = useState('')
  const [showTransferMethod, setShowTransferMethod] = useState({
    atm: false,
    iBanking: false,
    mBanking: false
  })
  const [data, setData] = useState({
    name: '',
    phoneNumber: '',
    price: '',
    paymentDeadline: '',
    create_at: '',
    orderType: '',
    status: '',
    profName: '',
    profVA: '',
    detail: ''
  })

  useEffect(() => {
    async function mount() {
      try {
        setLoading(true)
        const { data } = await api.get(`orders/${orderId}`, user.token)
        setData({
          name: data.client_name,
          phoneNumber: data.client_phone_number,
          price: data.price,
          paymentDeadline: data.payment_deadline,
          createdAt: data.created_at,
          orderType: data.type,
          status: data.status,
          profName: data.professional.name,
          profVA: data.professional.account_number,
          detail: data.detail
        })
        setLoading(false)
      } catch (e) {
        console.log(`${e.response.data}`)
        setError(`${e}`)
        setLoading(false)
      }
    }

    mount()
  }, [])

  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger'
      })

      setError('')
    }
  }, [error])

  const copyNumToClipboard = () => {
    Clipboard.setString(data.profVA)
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT)
  }

  const handleChoosePhoto = () => {
    setIsSelectModalVisible(!isSelectModalVisible)
  }

  const handleToggleTransferMethod = (prop) => {
    setShowTransferMethod((prev) => ({
      ...prev,
      [prop]: !prev[prop]
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsSubmit(true)
      const data = new FormData()
      data.append('image', {
        name: image.fileName,
        type: image.type,
        uri: Platform.OS === 'ios' ?
          image.uri.replace('file://', '')
          : image.uri
      })
      const { data: data1 } = await api.post(`orders/${orderId}/update`, user.token, data, { type: 1 }, {
        'Content-Type': "multipart/formdata"
      })
      console.log(data1)
      navigation.replace('Order Detail',{ oid : orderId})
    } catch (e) {
      console.log('error', e.response.data)
      setError(`${e}`)
      setIsSubmit(false)
    }
  }

  const onCancel = async () => {
    try {
      setIsSubmit(true)
      const { data } = await api.post(`orders/${orderId}/update`, user.token, null, { type: 2 })
      console.log(data)
      navigation.goBack()
    } catch (e) {
      console.log('error', e.response.data)
      setError(`${e}`)
      setIsSubmit(false)
    }
  }

  const handleCancel = () => {
    Alert.alert('Alert', 'Apakah anda yakin ingin membatalkan pesanan', [
      {
        text: 'Ya',
        onPress: () => onCancel()
      },
      {
        text: 'Tidak',
        style: 'cancel'
      }
    ], {
      cancelable: true
    })
  }

  const duration = () => {
    const now = moment();
    const deadline = moment(data.paymentDeadline);
    const hours = deadline.diff(now, 'hours');
    const minutes = moment.duration(deadline.diff(now)).minutes();
    return `${hours} jam ${minutes} menit`
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container.Main>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Container.row alignItems={'center'}>
            <Text.Main flex={1} style={styles.font}>Selesaikan dalam</Text.Main>
            <Text.Main color={color.primary} fontWeight={'bold'} style={styles.font}>
              {duration()}
            </Text.Main>
          </Container.row>
          <View style={styles.topContainer}>
            <Container.row alignItems={'center'} >
              <Image
                source={data.orderType?.id === 1 ? ExteIcon : InteriorIcon}
                style={styles.typeIcon} />
              <View style={{ flex: 1, marginHorizontal: 8 }}>
                <Text.Main numberOfLines={2} style={styles.font}>
                  {data.orderType?.name} oleh {data.profName}
                </Text.Main>
                <Text.Main fontSize={14} lineHeight={22}>
                  {moment(data.create_at).format('DD MMM YYYY')}
                </Text.Main>
              </View>
              <TouchableOpacity onPress={() => setShowDetail(!showDetail)}>
                <Icon name={showDetail ? 'chevron-up' : 'chevron-down'} size={20} color={'black'} style={styles.chevronIcon} />
              </TouchableOpacity>
            </Container.row>
            {
              showDetail ? (
                <View style={styles.detailContainer}>
                  <Text.Main style={styles.font} marginBottom={10}>Detail Pesanan</Text.Main>
                  <Text.Main marginBottom={5}>Nama pemesan : {data.name}</Text.Main>
                  <Text.Main marginBottom={5}>Nomor HP : {data.phoneNumber}</Text.Main>
                  {
                    data.orderType?.id === 1 ?
                      (
                        <View>
                          <Text.Main marginBottom={5}>Jenis paket : {data.detail?.package_name}</Text.Main>
                          <Text.Main marginBottom={5}>Luas bangunan : {data.detail?.building_area} m²</Text.Main>
                          <Text.Main marginBottom={5}>Ukuran tanah: {data.detail?.land_length} x {data.detail?.land_width}</Text.Main>
                          <Text.Main marginBottom={5}>Estimasi budget: Rp {rupiahFormat(data.detail?.budget_estimation)}</Text.Main>
                          <Text.Main marginBottom={5}>Jumlah lantai: {data.detail?.floor_count}</Text.Main>
                          <Text.Main marginBottom={5}>Jenis Desain : {data.detail?.style_name}</Text.Main>
                          {
                            data.detail.rooms ? data.detail.rooms.map((item, i) => (
                              <Text.Main key={i} marginBottom={5}>Jumlah {item.name} : {item.quantity}</Text.Main>
                            )) : null
                          }
                        </View>
                      )
                      :
                      (
                        <View>
                          <Text.Main marginBottom={5}>Jumlah Ruangan : {data.detail.length}</Text.Main>
                          {
                            data.detail.map((item, index) => {
                              return (
                                <View style={{ marginTop: 6 }} key={index}>
                                  <Text.Main marginBottom={8}>Ruangan {index + 1}</Text.Main>
                                  <Text.Main marginBottom={8}>Kategori : {item.room_category}</Text.Main>
                                  <Text.Main marginBottom={8}>Jenis Desain : {item.style_name}</Text.Main>
                                  <Text.Main marginBottom={8}>Luas ruangan : {item.room_area} m²</Text.Main>
                                  <Text.Main marginBottom={8}>Ukuran ruangan : {item.room_length} x {item.room_width}</Text.Main>
                                </View>
                              )
                            })
                          }
                        </View>
                      )
                  }
                </View>
              ) : null
            }
          </View>
          <View style={styles.greyBar} />
          <View>
            <Text.Main fontSize={16}>Lakukan Transfer ke</Text.Main>
            <Container.row marginTop={15} marginBottom={11}>
              <Image source={BCAIcon} />
              <Text.Main marginLeft={10}>Rekening BCA</Text.Main>
            </Container.row>
            <TouchableOpacity onPress={copyNumToClipboard} activeOpacity={1}>
              <View style={styles.VAContainer}>
                <Text.Main style={styles.VAText}>{data.profVA}</Text.Main>
              </View>
            </TouchableOpacity>
            <Text.Main fontSize={16} marginBottom={11}>Total Pembayaran</Text.Main>
            <View style={styles.VAContainer}>
              <Text.Main style={styles.VAText}>Rp {rupiahFormat(data.price)}</Text.Main>
            </View>
          </View>
          <View marginBottom={15}>
            <Container.row>
              <Text.Main flex={1} fontSize={15}>Upload bukti transfermu disini</Text.Main>
              <TouchableOpacity onPress={handleChoosePhoto}>
                <Icon name="plus-circle-outline" size={20} color={'black'} />
              </TouchableOpacity>
            </Container.row>
            {
              image ? (
                <View style={styles.takenImageContainer}>
                  <Image source={{ uri: image.uri }} style={styles.takenImage} />
                </View>
              ) : null
            }
          </View>
          <View style={styles.howToTransferContainer}>
            <Text.Main fontSize={15} paddingHorizontal={8} paddingVertical={8}>
              Panduan Pembayaran
            </Text.Main>
            <TouchableOpacity onPress={() => handleToggleTransferMethod('atm')}>
              <View style={styles.methodItemContainer}>
                <Container.row >
                  <Text.Main fontSize={15} flex={1}>Transfer Melalui ATM</Text.Main>
                  <Icon name={showTransferMethod.atm ? 'chevron-up' : 'chevron-down'} size={20} color={'black'} />
                </Container.row>
                <View style={{ display: showTransferMethod.atm ? 'flex' : 'none', ...styles.transferMethod }}>
                  <Text.Main numberOfLines={0} lineHeight={22}>{transferSteps.atm}</Text.Main>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleToggleTransferMethod('iBanking')}>
              <View style={styles.methodItemContainer}>
                <Container.row >
                  <Text.Main fontSize={15} flex={1}>Transfer Melalui Internet Banking</Text.Main>
                  <Icon name={showTransferMethod.iBanking ? 'chevron-up' : 'chevron-down'} size={20} color={'black'} />
                </Container.row>
                <View style={{ display: showTransferMethod.iBanking ? 'flex' : 'none', ...styles.transferMethod }}>
                  <Text.Main numberOfLines={0} lineHeight={22}>{transferSteps.iBanking}</Text.Main>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleToggleTransferMethod('mBanking')}>
              <View style={styles.methodItemContainer}>
                <Container.row >
                  <Text.Main fontSize={15} flex={1}>Transfer Melalui Mobile Banking</Text.Main>
                  <Icon name={showTransferMethod.mBanking ? 'chevron-up' : 'chevron-down'} size={20} color={'black'} />
                </Container.row>
                <View style={{ display: showTransferMethod.mBanking ? 'flex' : 'none', ...styles.transferMethod }}>
                  <Text.Main numberOfLines={0} lineHeight={22}>{transferSteps.mBanking}</Text.Main>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ padding: 8 }}>
            <Button title="Batalkan" color={'lightgrey'} onPress={handleCancel} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title='Kirim' color={color.primary} disabled={!image} onPress={handleSubmit} />
      </View>
      <Modal.SelectGalleryOrCamera
        isVisible={isSelectModalVisible}
        toggleModal={handleChoosePhoto}
        selectImage={(image) => setImage(image)}
      />
      <Modal.Loading1
        isVisible={isSubmit} 
      />
    </Container.Main>
  )
}

export default OrderPayment

const styles = StyleSheet.create({
  typeIcon: {
    width: 70,
    aspectRatio: 4 / 3,
    resizeMode: 'contain'
  },
  chevronIcon: {
    backgroundColor: 'white',
    borderRadius: 20
  },
  topContainer: {
    backgroundColor: 'lightgrey',
    marginVertical: 15,
    padding: 9,
    borderRadius: 8,
  },
  detailContainer: {
    marginVertical: 20,
    borderColor: 'black',
    borderTopWidth: .5,
    paddingTop: 10,
  },
  font: {
    fontSize: 15,
    lineHeight: 22
  },
  VAContainer: {
    backgroundColor: 'lightgrey',
    borderRadius: 8,
    padding: 8,
    paddingLeft: 15,
    marginBottom: 17
  },
  VAText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  greyBar: {
    height: 1.5,
    backgroundColor: 'lightgrey',
    marginBottom: 15,
    marginLeft: -20,
    marginRight: -20
  },
  howToTransferContainer: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 15
  },
  methodItemContainer: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    padding: 9
  },
  transferMethod: {
    padding: 8
  },
  takenImage: {
    height: 240,
    width: 250,
    resizeMode: 'cover'
  },
  takenImageContainer: {
    marginVertical: 10,
    alignItems: 'center'
  },
  buttonContainer: {
    padding: 15,
    marginTop: 'auto',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  }
})
