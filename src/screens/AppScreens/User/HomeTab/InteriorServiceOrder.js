import React, { useState, useEffect, useContext, useLayoutEffect, useRef } from 'react'
import { Dimensions, StyleSheet, View, BackHandler, TouchableNativeFeedback, Keyboard, Image, TouchableOpacity, Platform } from 'react-native'
import AuthContext from '../../../../context/AuthContext'
import * as Container from '../../../../components/Container'
import * as Text from '../../../../components/Text'
import * as Button from '../../../../components/Button'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as Modal from '../../../../components/Modal'
import * as TextField from '../../../../components/TextField'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { showMessage } from 'react-native-flash-message'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { api, rupiahFormat } from '../../../../utils'
import Loading from '../../../../components/Loading'

const { width, height } = Dimensions.get('window')

const InteriorServiceOrder = ({ navigation, route }) => {
  const { user } = useContext(AuthContext)
  const [form, setForm] = useState(true)
  const [isAddRoom, setAddRoom] = useState(false)
  const [roomList, setRoomList] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [designOption, setDesignOption] = useState([])
  const [roomOption, setRoomOption] = useState([])
  const [modal, setModal] = useState({
    visible: false,
    type: null
  })
  const scrollViewRef = useRef(null)
  const [photos, setPhotos] = useState([])
  const [isModalAddPhotoVisible, setModalAddPhotoVisible] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')

  const designPrice = [
    { roomArea: '0 - 20 m²', cost: 1200000 },
    { roomArea: '21 - 30 m²', cost: 2500000 },
    { roomArea: '>30 m²', cost: 3400000 },
  ]

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true)
        const { data } = await api.get('design/filters', user.token)
        setDesignOption(data.designs)
        data.rooms.splice(7, 1)
        data.rooms.forEach(item => {
          const arr = item.name.toLowerCase().split(' ')
          for (let i = 1; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
          }
          item.var = arr.join('') + 'Count'
        })
        setRoomOption(data.rooms)
        setLoading(false)
      } catch (e) {
        setError(e.toString())
        setLoading(false)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger'
      })
    }
  }, [error])

  const backAction = () => {
    if (form) {
      navigation.goBack()
    } else {
      setForm(true)
      setAddRoom(false)
      Keyboard.dismiss()
      if(selectedRoom){
        setSelectedRoom('')
        setPhotos([])
      }
    }

    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return (() =>
      BackHandler.removeEventListener('hardwareBackPress', backAction));
  }, [form])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <TouchableNativeFeedback onPress={backAction} >
          <View {...props} style={{ marginRight: 20 }}>
            <Icon name="arrow-left" size={25} color={'#555555'} />
          </View>
        </TouchableNativeFeedback>
      ),
      title: form ? 'Order' : 'Tambah Ruangan'
    })
  }, [form])

  const handleOpenAddRoom = () => {
    setAddRoom(true)
    setForm(false)
    scrollViewRef.current.scrollToPosition(0, 0, false)
  }

  const calculatePrice = (size) => {
    let area = parseInt(size)
    if(area <= 20) {
      return 1200000
    }else if ( area > 20 && area < 30) {
      return 2500000
    }else {
      return 3400000
    }
  }

  const getTotalPrice = () => {
    const sum = roomList.reduce((total, val) => {
      return total + calculatePrice(val.area)
    }, 0)

    return sum
  }

  const orderValidation = Yup.object({
    name: Yup.string().trim()
      .required("Nama harus diisi")
      .min(3, 'Panjang minimal 3 karakter'),
    phoneNumber: Yup.string()
      .required("No HP / WA harus diisi")
      .min(9, 'Panjang nomor minimal 9')
      .max(14, 'Panjang nomor maksimal 14')
      .matches(/^08\d{7,12}$/, 'Format nomor belum benar'),
  })

  const AddRoomValidation = Yup.object({
    roomType: Yup.object()
      .required('kategori wajib dipilih'),
    roomStyle: Yup.object()
      .required('style ruangan wajib dipilih'),
    roomArea: Yup.string()
    .matches(/^\d+$/, 'hanya boleh diisi angka')
    .required('luas harus diisi'),
    roomWidth: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .required('panjang harus diisi'),
    roomLength: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .required('panjang harus diisi'),
    note: Yup.string()
      .max(255, 'maksimal 255 karakter')
      .notRequired()
  })

  const handleOpenEditRoom = (item) => {
    setSelectedRoom(item)
    setPhotos(item.photos)
    setForm(false)
    setAddRoom(true)
    scrollViewRef.current.scrollToPosition(0, 0, false)
  }
 
  const removeRooms = (id) => {
    const arr = roomList.filter(item => item.id != id)
    setRoomList(arr)
  }

  const renderPhotos = photos.map((item, index) => {
    return (
      <View key={index} style={styles.photoItemContainer}>
        <Image
          source={{ uri : item.photo?.uri}} 
          style={styles.photo}/>
        <Text.Main numberOfLines={2} marginHorizontal={10} fontSize={14} flex={1}>{item.description}</Text.Main>
        <TouchableOpacity onPress={() => {
          const photo2 = photos.filter(item2 => { return item2.photo.fileName != item.photo.fileName })
          setPhotos(photo2)
        }}>
          <Icon name="delete" size={23} style={{marginLeft: 'auto'}}/>
        </TouchableOpacity>
      </View>
    )
  })

  const renderRooms = roomList.map((item, index) => {
    return (
      <TouchableNativeFeedback key={index} onPress={() => handleOpenEditRoom(item)}>
        <View style={styles.roomListContainer}>
          <Container.row>
            <View style={{flex: 1}}>
              <Text.Main fontSize={15} marginBottom={7}>Ruangan {item.id}</Text.Main>
              <Container.row alignItems={'flex-start'}>
                <View style={{flex: .5, marginRight: 4}}>
                  <Text.Main marginBottom={5}>Kategori : {item.type.name}</Text.Main>
                  <Text.Main marginBottom={5}>Desain : {item.style.name}</Text.Main>
                </View>
                <View style={{flex: .5, marginRight: 4}}>
                  <Text.Main marginBottom={5}>Ukuran : {item.length} x {item.width} m </Text.Main>
                  <Text.Main>Luas : {item.area} m² </Text.Main>
                </View>
              </Container.row>
              <Text.Main>Harga : Rp {rupiahFormat(calculatePrice(item.area))}</Text.Main>
            </View>
            <TouchableOpacity onPress={() => removeRooms(item.id)}>
              <Icon name='delete' size={23}/>
            </TouchableOpacity>
          </Container.row>
        </View>
      </TouchableNativeFeedback>
    )
  })

  const handleOnSubmit = async(values, setSubmitting) => {
    const { name, phoneNumber } = values
    const mapping_rooms = roomList.map((item) => ({
      room_id : item.type.id,
      style_id : item.style.id,
      room_area : parseInt(item.area),
      room_width: parseInt(item.width),
      room_length: parseInt(item.length),
      note: item.note
    }))
    const body = {
      data: {
        professional_id : route.params.pid,
        name: name,
        phone_number: phoneNumber,
        price: getTotalPrice(),
        type_id : 2
      },
      mapping_rooms: mapping_rooms
    }

    try{
      const { data } = await api.post('orders', user.token, body, { type: 2})
      const orderId = data.order.id, mapIds= data.map_ids
      console.log(orderId, mapIds)
      const promises = []
      mapIds.forEach((item, idx) => {
        if(roomList[idx].photos.length > 0){
          const promise = new Promise((res, rej) => {
            const data = new FormData()
            roomList[idx].photos.forEach(item => {
              data.append('images[]', {
                name: item.photo.fileName,
                type: item.photo.type,
                uri: Platform.OS === 'ios' ?
                  item.photo.uri.replace('file://', '')
                  : item.photo.uri,
              })
              data.append('descriptions[]', item.description)
            })

            api.post(`orders/${item}/images`, user.token, data, { type: 2}, {
              "Content-Type" : "multipart/form-data"
            }).then((res1) => res(res1.data))
            .catch((e) => {
              console.log(e.response.data)
              rej(e.response.data)
            })
          }).catch(e => e)

          promises.push(promise)
        }
      })

      if(promises.length > 0 ){
        await Promise.all(promises)
        console.log("images have been uploaded")
      }

      navigation.replace('Order Payment', { orderId: orderId })
    }catch(error){
      console.log(error.response.data)
      setError(`${error}`)
      setSubmitting(false)
    }
  }

  if (loading) return <Loading />

  return (
    <Container.Main>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll={true}
        enableOnAndroid={true}>
        {/* Form */}
        <View style={{ ...styles.container, ...form && { display: 'flex' } }}>
          <Formik
            initialValues={{
              name: user?.user.name,
              phoneNumber: ''
            }}
            validationSchema={orderValidation}
            onSubmit={(values, { setSubmitting }) => {
              handleOnSubmit(values, setSubmitting)
            }}>
            {
              ({ handleChange, handleBlur, errors, touched, values, handleSubmit, ...props }) => (
                <View>
                  <Text.Main fontWeight={'bold'} fontSize={16} marginBottom={20}>Informasi Pribadi</Text.Main>
                  <TextField.Form
                    label="Nama"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    error={touched.name && errors.name} />
                  <TextField.Form
                    label="No HP / WA"
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                    error={touched.phoneNumber && errors.phoneNumber}
                    keyboardType="numeric" />
                  <Text.Main fontWeight={'bold'} fontSize={16} marginBottom={20}>Detail Ruangan</Text.Main>
                  <View style={{borderWidth: .8, borderRadius: 8, padding: 10, width: width * 280/width, marginLeft: 'auto', marginRight: 'auto', marginBottom: 18}}>
                    <Text.Main>Harga</Text.Main>
                    <Container.row marginVertical={6}>
                      <Text.Main style={styles.roomAreaText}>Luas Ruangan</Text.Main>
                      <Text.Main style={styles.costText}>Biaya</Text.Main>
                    </Container.row>
                    {
                      designPrice.map((item, idx) => (
                        <Container.row marginBottom={6} key={idx}>
                          <Text.Main style={styles.roomAreaText}>{item.roomArea}</Text.Main>
                          <Text.Main style={styles.costText}>Rp {rupiahFormat(item.cost)}</Text.Main>
                        </Container.row>
                      ))
                    }
                  </View>
                  {renderRooms}
                  <Button.PrimaryButton
                    onPress={handleOpenAddRoom}
                    isDisabled={roomList.length > 5}
                    title={"Tambah Ruangan"}
                    height={height * 40 / height}
                    width={width * 150 / width}
                    fontStyle={{
                      fontSize: 14
                    }}
                    marginLeft={'auto'}
                    marginRight={'auto'}
                  />
                {
                  roomList.length > 0 && (
                    <View>
                      <View style={styles.priceWrapper}>
                        <Text.Main fontSize={15}>Total Harga</Text.Main>
                        <Text.Main fontSize={15}>Rp {rupiahFormat(getTotalPrice())}</Text.Main>
                      </View>
                        <Button.PrimaryButton
                        isDisabled={props.isSubmitting}
                        onPress={handleSubmit}
                        title={'Lanjut pembayaran'}
                        height={40}
                      />
                    </View>
                  )
                }
                <Modal.Loading1 
                  isVisible={props.isSubmitting}/>
                </View>
              )
            }
          </Formik>
        </View>
        {/* Form */}
   
        {/* AddRoom */}
        <View style={{ ...styles.container, ...isAddRoom && { display: 'flex' } }}>
          <Formik
            initialValues={{
              roomType: selectedRoom.type || '',
              roomStyle: selectedRoom.style || '',
              roomArea: selectedRoom.area || '',
              roomWidth: selectedRoom.width || '',
              roomLength: selectedRoom.length || '',
              note: selectedRoom.note || ''
            }}
            validationSchema={AddRoomValidation}
            enableReinitialize={true}
            onSubmit={(value, actions) => {
              const data = {
                type: value.roomType,
                style: value.roomStyle,
                length: value.roomLength,
                width: value.roomWidth,
                area: value.roomArea,
                note: value.note,
                photos: [...photos]
              }
              if(!selectedRoom){
                const lastId = roomList.slice(-1)[0]?.id
                const room = {
                  id: !lastId ? 1 : lastId + 1,
                  ...data
                }
                setRoomList((curr) => ([...curr, room]))
              } else{
                const idx = roomList.findIndex((item) => item.id === selectedRoom.id)
                const room = {
                  id: selectedRoom.id,
                  ...data
                }
                roomList[idx] = { ...room }
                setRoomList(roomList)
                setSelectedRoom('')
              }
           
              actions.resetForm()
              setPhotos([])
              setAddRoom(false)
              setForm(true)
            }}>
            {
              ({ handleChange, handleBlur, values, handleSubmit, errors, touched, ...props }) => (
                <View>
                  <View>
                    <TextField.Form
                      label="Kategori"
                      editable={false}
                      error={touched.roomType && errors.roomType}
                      value={values.roomType?.name}
                      dropdown
                      onDropdownPress={() => setModal({ visible: true, type: 'roomType' })}
                    />
                    <TextField.Form
                      label="Style Ruangan"
                      editable={false}
                      error={touched.roomStyle && errors.roomStyle}
                      value={values.roomStyle?.name}
                      dropdown
                      onDropdownPress={() => setModal({ visible: true, type: 'roomStyle' })}
                    />
                    <Modal.Primary
                      isVisible={modal.visible}
                      toggleModal={() => setModal(curr => ({ ...curr, visible: false }))}
                      designList={modal.type === 'roomType' ? roomOption : designOption}
                      selectedDesign={modal.type === 'roomType' ? values.roomType : values.roomStyle}
                      onChange={(value) => {
                        const type = modal.type === 'roomType' ? 'roomType' : 'roomStyle'
                        props.setFieldValue(type, value)
                      }}
                      onBlur={() => {
                        const type = modal.type === 'roomType' ? 'roomType' : 'roomStyle'
                        props.setFieldTouched(type, true)
                      }} 
                      label={modal.type === 'roomType' ? 'Kategori Ruangan' : 'Style Ruangan'}/>
                  </View>
                  <View>
                    <Text.Main fontSize={15} marginBottom={15} >Ukuran Ruangan</Text.Main>
                    <View style={{ flexDirection: 'row' }}>
                      <TextField.Form
                        label="Panjang"
                        onChangeText={handleChange('roomLength')}
                        onBlur={handleBlur('roomLength')}
                        value={values.roomLength}
                        error={touched.roomLength && errors.roomLength}
                        keyboardType="numeric"
                        suffix="m"
                        flex={.3} />
                      <Text.Main
                        marginHorizontal={23}
                        fontSize={15}>
                        x
                      </Text.Main>
                      <TextField.Form
                        label="Lebar"
                        onChangeText={handleChange('roomWidth')}
                        onBlur={handleBlur('roomWidth')}
                        value={values.roomWidth}
                        error={touched.roomWidth && errors.roomWidth}
                        keyboardType="numeric"
                        suffix={'m'}
                        flex={.3} />
                    </View>
                  </View>
                  <TextField.Form
                    label="Luas Ruangan"
                    error={touched.roomArea && errors.roomArea}
                    value={values.roomArea}
                    onChangeText={handleChange('roomArea')}
                    onBlur={handleBlur('roomArea')}
                    keyboardType="numeric"
                    suffix="m²"
                  />
                  <TextField.Form
                    label="Catatan Tambahan"
                    value={values.note}
                    onChangeText={handleChange('note')}
                    onBlur={handleBlur('note')}
                    error={touched.note && errors.note}
                    multiline />
                  <View style={{ marginBottom: 25 }}>
                    <Text.Main>Foto pendukung ({photos.length}/ 5)</Text.Main>
                    { photos.length < 5 &&
                      <TouchableNativeFeedback onPress={() => setModalAddPhotoVisible(true)}>
                        <View style={styles.addIconContainer}>
                          <Icon name="plus" size={25} color={'skyblue'} />
                        </View>
                      </TouchableNativeFeedback>
                    }
                    { renderPhotos }
                    <Modal.AddPhoto
                      isModalVisible={isModalAddPhotoVisible}
                      toggleModal={() => setModalAddPhotoVisible(!isModalAddPhotoVisible)}
                      onAddPhoto={(item) => setPhotos(curr => ([item, ...curr]))}
                     />
                  </View>
                  <Button.PrimaryButton
                    title={ !selectedRoom ? "Tambah" : "Update"}
                    fontStyle={{
                      fontSize: 14
                    }}
                    onPress={handleSubmit}
                    marginBottom={20}
                    marginHorizontal={15}
                  />
                </View>
              )
            }
          </Formik>
        </View>
        {/* AddRoom */}
      </KeyboardAwareScrollView>
    </Container.Main>
  )
}

export default InteriorServiceOrder

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    display: 'none'
  },
  roomAreaText: {
    flex: 0.5
  },
  costText: {
    flex: 0.5
  },
  addIconContainer: {
    backgroundColor: 'lightgrey',
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    aspectRatio: 4 / 3
  },
  photoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  photo:{
    height: 80,
    width: 80
  },
  roomListContainer: {
    borderWidth: .8,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20
  },
})
