import React, { useState, useEffect, useContext, useLayoutEffect, useRef } from 'react'
import { Dimensions, StyleSheet, View, BackHandler, TouchableNativeFeedback, Keyboard, Image, TouchableOpacity, Platform } from 'react-native'
import * as Container from '../../../components/Container'
import * as Text from '../../../components/Text'
import * as Card from '../../../components/Card'
import { homeArchitecturePackage, api, rupiahFormat } from '../../../utils'
import * as Button from '../../../components/Button'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import AuthContext from '../../../context/AuthContext'
import { showMessage } from 'react-native-flash-message'
import Loading from '../../../components/Loading'
import * as Modal from '../../../components/Modal'
import * as TextField from '../../../components/TextField'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { height, width } = Dimensions.get('window')

const ArchitectServiceOrder = ({ route, navigation }) => {
  const [choosePackage, setChoosePackage] = useState(true)
  const [form, setForm] = useState(false)
  const [paket, setPaket] = useState('')
  const [designStyles, setDesignStyles] = useState([])
  const [roomList, setRoomList] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)
  const [isModalAddPhotoVisible, setModalAddPhotoVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)
  const [photos, setPhotos] = useState([])
  const scrollViewRef = useRef(null)

  const pakets = homeArchitecturePackage.map((item, idx) => {
    return (
      <Card.Package
        key={idx}
        item={item}
        onPress={(packet) => setPaket(packet)}
        selectedPaket={paket} />
    )
  })

  const onAfterSelect = () => {
    setChoosePackage(false)
    setForm(true)
    scrollViewRef.current.scrollToPosition(0, 0, false)
  }

  const backAction = () => {
    if (form) {
      setForm(false)
      setChoosePackage(true)
      Keyboard.dismiss()
    } else {
      navigation.goBack()
    }
    return true
  }

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true)
        const { data } = await api.get('design/filters', user.token)
        setDesignStyles(data.designs)
        data.rooms.splice(7, 3)
        data.rooms.forEach(item => {
          const arr = item.name.toLowerCase().split(' ')
          for (let i = 1; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
          }
          item.var = arr.join('') + 'Count'
        })
        setRoomList(data.rooms)
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
      setError('')
    }
  }, [error])

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
      title: 'Order'
    })
  }, [form])

  const validationSchema = Yup.object({
    name: Yup.string().trim()
      .required("Nama harus diisi")
      .min(3, 'Panjang minimal 3 karakter'),
    phoneNumber: Yup.string()
      .required("No HP / WA harus diisi")
      .min(9, 'Panjang nomor minimal 9')
      .max(14, 'Panjang nomor maksimal 14')
      .matches(/^08\d{7,12}$/, 'Format nomor belum benar'),
    designType: Yup.object()
      .required('jenis desain harus diisi'),
    landLength: Yup.string().trim()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .required('panjang harus diisi'),
    landWidth: Yup.string().trim()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .required('lebar harus diisi'),
    buildingArea: Yup.string().trim()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .required('Luas bangunan harus diisi'),
    budgetEstimation: Yup.string().trim()
      .matches(/^[.\d]+$/, 'hanya boleh diisi angka')
      .required('estimasi budget harus diisi'),
    floorCount: Yup.string().trim()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .required('Jumlah lantain harus diisi'),
    dapurCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    ruangMakanCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    ruangKeluargaCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    kamarTidurCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    kamarMandiCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    ruangKerjaCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    laundryCount: Yup.string()
      .matches(/^\d+$/, 'hanya boleh diisi angka')
      .notRequired(),
    other: Yup.string()
      .max(255, 'maksimal 255 karakter')
      .notRequired()
  })

  const handleAddPhoto = (photo) => {
    setPhotos((prev) => ([ photo, ...prev]))
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

  const handleSubmit = async (values, setSubmitting) => {
    const { name, phoneNumber, designType, landWidth, landLength, buildingArea, budgetEstimation, floorCount, other} = values
    const mapping_rooms = roomList.filter((item) => {
      if(parseInt(values[`${item.var}`]) > 0) return true
    }).map(item => ({
        room_id : item.id,
        quantity: parseInt(values[`${item.var}`])
    }))

    const body = {
      "data" : {
        professional_id : route.params.pid,
        name,
        phone_number: phoneNumber,
        price: paket.price * buildingArea,
        type_id : 1
      },
      "detail" : {
        style_id : designType.id,
        land_width: parseInt(landWidth),
        land_length: parseInt(landLength),
        building_area: parseInt(buildingArea),
        budget_estimation: budgetEstimation.replace('.', ''),
        floor_count: parseInt(floorCount),
        note: other,
        package_Id: paket.id
      },
      "mapping_rooms": mapping_rooms
    }

    console.log('body', body)

    try{
      const { data : { order }} = await api.post('orders', user.token, body, { type: 1})
      if(photos.length > 0){
        const data = new FormData()
        photos.forEach(item => {
          data.append('images[]', {
            name: item.photo.fileName,
            type: item.photo.type,
            uri: Platform.OS === 'ios' ?
              item.photo.uri.replace('file://', '')
              : item.photo.uri,
          })
          data.append('descriptions[]', item.description)
        })

        await api.post(`orders/${order.id}/images`, user.token, data, { type: 1 } , {
          "Content-Type" : "multipart/form-data"
        })
      }
      navigation.replace('Order Payment', { oid: order.id })
    } catch(error){
      console.log(error.response.data)
      setError(`${error}`)
      setSubmitting(false)
    }
  }

  {console.log(route.params?.pid)}
  
  if (loading) {
    return <Loading />
  }

  return (
    <Container.Main>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        // enableAutomaticScroll={true}
        // enableOnAndroid={true}
        >
        {/* choosePackage */}
        <View style={{ ...styles.container, ...choosePackage && { display: 'flex' } }}>
          <Text.Main textAlign={'center'} fontSize={18}>Pilih Paket</Text.Main>
          <View style={{ alignItems: 'center' }}>
            {pakets}
          </View>
        </View>
        {/* Form */}
        <View style={{ ...styles.container, ...form && { display: 'flex' } }}>
          <Formik
            initialValues={{
              name: user?.user.name,
              phoneNumber: '',
              designType: '',
              landWidth: '',
              landLength: '',
              buildingArea: '',
              budgetEstimation: '',
              floorCount: '',
              dapurCount: '',
              ruangMakanCount: '',
              ruangKeluargaCount: '',
              kamarTidurCount: '',
              kamarMandiCount: '',
              ruangKerjaCount: '',
              laundryCount: '',
              other: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting) }>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, ...props }) => (
              <View>
                <Text.Main fontWeight={'bold'} fontSize={16} marginBottom={20}>Informasi Pribadi</Text.Main>
                <TextField.Form
                  label="Nama"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                />
                <TextField.Form
                  label="No HP / WA"
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  error={touched.phoneNumber && errors.phoneNumber}
                  keyboardType="numeric"
                />
                 <Text.Main fontWeight={'bold'} fontSize={16} marginBottom={20}>Detail Rumah</Text.Main>
                <View>
                  <TextField.Form
                    label="Jenis Desain"
                    value={values.designType.name}
                    editable={false}
                    error={touched.designType && errors.designType}
                    dropdown
                    onDropdownPress={() => setModalVisible(true)}
                  />
                  <Modal.Primary
                    isVisible={isModalVisible}
                    toggleModal={() => setModalVisible(!isModalVisible)}
                    designList={designStyles}
                    selectedDesign={values.designType}
                    onChange={(value) => {
                      props.setFieldValue('designType', value)
                    }}
                    onBlur={() => {
                      props.setFieldTouched('designType', true)
                    }}
                    label={'Jenis Desain'}
                  />
                </View>
                <View>
                  <Text.Main fontSize={15} marginBottom={15} >Ukuran Tanah</Text.Main>
                  <View style={styles.landSizeInputWrapper}>
                    <TextField.Form
                      label="Panjang"
                      onChangeText={handleChange('landLength')}
                      onBlur={handleBlur('landLength')}
                      value={values.landLength}
                      error={touched.landLength && errors.landLength}
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
                      onChangeText={handleChange('landWidth')}
                      onBlur={handleBlur('landWidth')}
                      value={values.landWidth}
                      error={touched.landWidth && errors.landWidth}
                      keyboardType="numeric"
                      suffix={'m'}
                      flex={.3} />
                  </View>
                </View>
                <TextField.Form
                  label="Luas Bangunan"
                  value={values.buildingArea}
                  onChangeText={handleChange('buildingArea')}
                  onBlur={handleBlur('buildingArea')}
                  error={touched.buildingArea && errors.buildingArea}
                  keyboardType="numeric"
                  suffix="m²"
                />
                <TextField.Form
                  label="Jumlah Lantai"
                  value={values.floorCount}
                  onChangeText={handleChange('floorCount')}
                  onBlur={handleBlur('floorCount')}
                  error={touched.floorCount && errors.floorCount}
                  keyboardType="numeric"
                />
                <View>
                  {
                    roomList.map((item, index) => {
                      return (
                        <TextField.SubForm
                          key={index}
                          label={`Jumlah ${item.name}`}
                          value={values[`${item.var}`]}
                          onChangeText={handleChange(`${item.var}`)}
                          onBlur={handleBlur(`${item.var}`)}
                          error={touched[`${item.var}`] && errors[`${item.var}`]}
                          keyboardType='numeric' />
                      )
                    })
                  }
                  <TextField.SubForm
                    label={`Lainnya`}
                    value={values.other}
                    onChangeText={handleChange(`other`)}
                    onBlur={handleBlur(`other`)}
                    error={touched.other && errors.other}
                    multiline />
                </View>
                <TextField.Form
                  label="Estimasi budget yang dimiliki"
                  value={rupiahFormat(values.budgetEstimation)}
                  onChangeText={handleChange('budgetEstimation')}
                  onBlur={handleBlur('budgetEstimation')}
                  error={touched.budgetEstimation && errors.budgetEstimation}
                  keyboardType="numeric"
                  prefix="Rp"
                />
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
                    onAddPhoto={handleAddPhoto} />
                </View>
                <View style={styles.priceWrapper}>
                  <Text.Main fontSize={15}>Jenis Paket</Text.Main>
                  <Text.Main fontSize={15}>{paket?.name}</Text.Main>
                </View>
                <View style={styles.priceWrapper}>
                  <Text.Main fontSize={15}>Total Harga</Text.Main>
                  <Text.Main fontSize={15}>Rp {rupiahFormat(paket?.price * values.buildingArea)}</Text.Main>
                </View>
                <Button.PrimaryButton
                  isDisabled={props.isSubmitting}
                  onPress={handleSubmit}
                  title={'Lanjut pembayaran'}
                  marginHorizontal={5}
                  marginTop={25}
                  height={40}
                />
                <Modal.Loading1 
                  isVisible={props.isSubmitting}/>
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
      {
        choosePackage ?
          <View style={styles.buttonContainer}>

            <View style={{ alignItems: 'center' }}>
              <Button.PrimaryButton
                title={'Lanjut'}
                isDisabled={!paket}
                onPress={onAfterSelect}
                paddingHorizontal={20}
                height={height * 0.0585}
                arrowRight={true}
                fontStyle={{
                  fontSize: 14
                }} />
            </View>

          </View>
          : null
      }
    </Container.Main>
  )
}

export default ArchitectServiceOrder

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    display: 'none'
  },
  buttonContainer: {
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    marginTop: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  landSizeInputWrapper: {
    flexDirection: 'row',
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
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
  }
})
