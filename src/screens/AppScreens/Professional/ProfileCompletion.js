import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Button, Platform } from 'react-native'
import * as Container from '../../../components/Container'
import { Main as Text } from '../../../components/Text'
import AuthContext from '../../../context/AuthContext'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { api, color, professionalType } from '../../../utils'
import * as TextInput from '../../../components/TextField'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { launchImageLibrary } from 'react-native-image-picker'
import Loading from '../../../components/Loading'
import * as Modal from '../../../components/Modal'
import { showMessage } from 'react-native-flash-message'

const ProfileCompletion = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [addressPoint, setAddressPoint] = useState('')
  const [picture, setPicture] = useState({
    profile: '',
    cover: ''
  })
  const [picType, setPicType] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user: { user, token } } = useContext(AuthContext)
  const { name, email, phone_number, type_id } = user
  const type = professionalType.find(item => item.id === type_id)

  useEffect(() => {
    async function mount() {
      try {
        setLoading(true)
        const { data } = await api.get('professional/cities', token)
        const mapName = data.map(item => {
          item.name = item.name + ", " + item.province_name
          return item 
        }) 
        setCities(mapName)
        setLoading(false)
      } catch (error) {
        console.log(error.response.data)
        setLoading(false)
      }
    }

    mount()
  }, [])

  const renderMap = () => {
    navigation.navigate('Map', { 
      selectedLocation : addressPoint,
      fromCompleteProfile: true 
    })
  }

  useEffect(() => {
    if(route.params?.location){
      setAddressPoint(route.params?.location)
    }
  }, [route.params?.location])

  const handleOpenPicker = async (type) => {
    launchImageLibrary({
      quality: 1,
      mediaType: 'photo'
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        setPicType(type)
        navigation.navigate('Photo',{
          data: response.assets[0],
          from: 'Profile Completion',
          isUpload: true
        })
      }
    })
  }

  const onPressPhoto = (image) => navigation.navigate('Photo', {
    data: { uri : image},
    from: 'Profile Completion'
  })

  useEffect(() => {
    if(route.params?.image){
      setPicture(prev => ({
        ...prev,
        [picType] : route.params.image
      }))
    }
  }, [route.params?.image])

  const validationSchema = Yup.object({
    description: Yup.string().trim()
      .required('deskripsi wajib diisi')
      .max(200, 'panjang karakter maksimal 200'),
    accountNo: Yup.string().trim()
      .required('nomor rekening wajib diisi')
      .matches(/^\d+$/, 'hanya boleh diisi angka'),
    address: Yup.string().trim()
      .required('alamat wajib diisi'),
    city: Yup.object()
      .required('kota wajib dipilih')
  })

  const onHandleSubmit = async(values) => {
    const { description, accountNo, address, city } = values
    const body = {
      description: description,
      account_number : accountNo,
      address,
      city_id : city.id,
      location : {
        latitude: addressPoint.latitude,
        longitude: addressPoint.longitude
      }
    }
    console.log(body)
    const files = new FormData
    Object.keys(picture).map(key => {
      files.append(`${key}_image`, {
        name: picture[key].fileName,
        uri: Platform.OS === 'ios' ?
              picture[key].uri.replace('file://', '')
              : picture[key].uri,
        type: picture[key].type
      })
    })
    
    try {
      setIsSubmitting(true)
      await api.post(`v1/professionals/${user.id}/update`, token, body)
      await api.post(`v1/professionals/${user.id}/image`, token, files, {} , {
        'Content-Type' : 'multipart/formdata'
      })
      navigation.navigate('Add Project', {
        firstRegister: true
      })
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      let err = error?.response?.data?.message
      showMessage({
        message: err ? err : error.toString(),
        type: 'danger'
      })
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container.Main>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={[styles.container]}>
          <Text>Halo, {name}</Text>
          <Text>
            Sebelum resmi menjadi mitra, silahkan lengkapi profile anda dibawah ini
            dengan benar
          </Text>
          <View>
            <Formik
              initialValues={{
                description: '',
                accountNo: '',
                address: '',
                city: ''
              }}
              validationSchema={validationSchema}
              onSubmit={(val) => onHandleSubmit(val)}
            >
              {({ handleChange, values, handleBlur, touched, errors, handleSubmit, ...props }) => (
                <View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.headerText}>Profile</Text>
                    <Text>Nama : {name}</Text>
                    <Text>Email : {email} </Text>
                    <Text>Nomor telepon : {phone_number}</Text>
                    <Text>Kategori : {type.name}</Text>
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.headerText}>Deskripsi</Text>
                    <Text style={styles.subText}>Masukkan deskripsi singkat tentang diri anda</Text>
                    <TextInput.Form
                      placeholder="Masukkan deskripsi"
                      onChangeText={handleChange('description')}
                      onBlur={handleBlur('description')}
                      value={values.description}
                      error={touched.description && errors.description}
                      multiline
                    />
                  </View>
                  <View style={{ ...styles.sectionContainer, marginTop: 0 }}>
                    <Text style={styles.headerText}>Nomor rekening BCA</Text>
                    <Text style={styles.subText}>Masukkan nomor rekening sebagai metode pembayaran</Text>
                    <TextInput.Form
                      onChangeText={handleChange('accountNo')}
                      onBlur={handleBlur('accountNo')}
                      value={values.accountNo}
                      error={touched.accountNo && errors.accountNo}
                      placeholder="Masukkan nomor rekening"
                      keyboardType="numeric" />
                  </View>
                  <View style={{ ...styles.sectionContainer, marginTop: 0 }}>
                    <Text style={styles.headerText}>Foto</Text>
                    <Text style={styles.subText}>Masukkan profile picture dan cover picture</Text>
                    <TouchableOpacity onPress={() => handleOpenPicker('profile')}>
                      <Container.row>
                        <Icon name='image' size={23} style={{ marginRight: 7 }} />
                        <Text>{picture.profile ? 'Ubah' : 'Upload'} foto profile</Text>
                      </Container.row>
                    </TouchableOpacity>
                    { picture.profile ?
                      <TouchableOpacity onPress={() => onPressPhoto(picture.profile.uri)}> 
                        <View style={{marginTop: 10}}>
                          <Image source={{uri : picture.profile.uri}} style={styles.picture}/>
                        </View>
                      </TouchableOpacity>
                      : null
                    }
                    <TouchableOpacity onPress={() => handleOpenPicker('cover')}>
                      <Container.row marginTop={10}>
                        <Icon name='image' size={23} style={{ marginRight: 7 }} />
                        <Text>{picture.cover ? 'Ubah' : 'Upload'} foto cover</Text>
                      </Container.row>
                    </TouchableOpacity>
                    {
                      picture.cover ?
                      <TouchableOpacity onPress={() => onPressPhoto(picture.cover.uri)}>
                        <View style={{marginTop: 10}}>
                          <Image source={{uri : picture.cover.uri}} style={styles.picture}/>
                        </View>
                      </TouchableOpacity> 
                      : null
                    }
                  </View>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.headerText}>Alamat</Text>
                    <Text style={styles.subText}>Masukkan kota, alamat lengkap dan pinpoint alamat</Text>
                    <TextInput.Form
                      placeholder={"Pilih kota"}
                      editable={false}
                      onDropdownPress={() => setModalVisible(true)}
                      value={values.city.name}
                      error={touched.city && errors.city}
                      dropdown />
                    <Modal.Form
                      isVisible={isModalVisible}
                      label={'Pilih Kota'}
                      optionList={cities}
                      selectedOption={values.city}
                      toggleModal={() => setModalVisible(!isModalVisible)}
                      onBlur={() => props.setFieldTouched('city', true)}
                      onChange={(val) => props.setFieldValue('city', val)}
                    />
                    <TextInput.Form
                      value={values.address}
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      error={touched.address && errors.address}
                      placeholder={"Masukkan alamat lengkap"} />
                    <TouchableOpacity onPress={renderMap}>
                      <View style={styles.pinpointButton}>
                        <Text flex={1}>Masukkan pinpoint alamat</Text>
                        <Icon name='chevron-right' size={20}/>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{marginBottom: 20}}>
                    <Button
                      onPress={handleSubmit}
                      disabled={(!addressPoint || !picture.profile || !picture.cover || !values.accountNo || !values.address || !values.city || !values.description)}
                      color={color.primary} 
                      title='Selanjutnya'/>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </ScrollView>
      <Modal.Loading1
        isVisible={isSubmitting} 
        />
    </Container.Main>
  )
}

export default ProfileCompletion

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20
  },
  sectionContainer: {
    marginTop: 15
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  subText: {
    marginBottom: 10,
    fontSize: 13
  },
  test: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  pinpointButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 24
  },
  picture: {
    width: 120,
    aspectRatio: 1
  }
})
