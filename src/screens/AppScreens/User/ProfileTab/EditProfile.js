import React, { useState, useEffect, useContext } from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import { showMessage } from 'react-native-flash-message'
import AuthContext from '../../../../context/AuthContext'
import * as TextInput from '../../../../components/TextField'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { launchImageLibrary } from 'react-native-image-picker'
import * as Modal from '../../../../components/Modal'
import * as Button from '../../../../components/Button'
import { api } from '../../../../utils'

const EditProfile = ({ navigation, route: { params } }) => {
  const { data } = params
  const { user } = useContext(AuthContext)
  const [photo, setPhoto] = useState({
    uri: data.image_path
  })
  const [isPhotoEdited, setPhotoEdited] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string().trim()
      .required('Nama wajib diisi')
  })

  const handleOpenPicker = async () => {
    launchImageLibrary({
      quality: 1,
      mediaType: 'photo'
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        navigation.navigate('Photo', {
          data: response.assets[0],
          from: 'Edit Profile',
          isUpload: true
        })
      }
    })
  }

  const onPressPhoto = (image) => navigation.navigate('Photo', {
    data: { uri: image },
    from: 'Edit Profile'
  })

  useEffect(() => {
    if (params?.image) {
      setPhoto(params.image)
      setPhotoEdited(true)
    }
  }, [params?.image])

  const handleSubmitUpdate = async (val) => {
    try {
      setIsSubmit(true)
      const data = new FormData
      data.append('name', val.name)
      if(isPhotoEdited){
        data.append('photo', {
          name: photo.fileName,
          type: photo.type,
          uri : Platform.OS === 'ios' ?
                photo.uri.replace('file://', '')
                : photo.uri,
        })
      }

      await api.post(`users/${user.user.id}`, user.token, data, {}, {
        'Content-Type' : 'multipart/form-data'
      })

      setIsSubmit(false)
      navigation.goBack()
      params.onGoBack()
      showMessage({
        message: 'Profile berhasil diupdate',
        type: 'success' 
      })
    } catch (error) {
      showMessage({
        message: 'error ' + error,
        type: 'danger'
      })
      setIsSubmit(false)
    }
  }

  return (
    <>
      <Container.Scroll>
        <Formik
          initialValues={{
            name: data.name,
          }}
          validationSchema={validationSchema}
          onSubmit={val => handleSubmitUpdate(val)}>
          {({ handleChange, handleBlur, values, errors, handleSubmit, touched, ...props }) => (
            <View>
              <TextInput.Form
                label="Nama"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name && errors.name}
              />
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <Text fontSize={15} marginRight={6}>Ubah Foto</Text>
                  <TouchableOpacity onPress={handleOpenPicker}>
                    <Icon name="plus" size={23} color={'black'} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => onPressPhoto(photo.uri)}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={{
                      height: 100, width: 100
                    }} />
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 20 }}>
                <Button.PrimaryButton
                  title={'Submit'}
                  height={'auto'}
                  width={130}
                  padding={8}
                  onPress={handleSubmit} />
              </View>
            </View>
          )}
        </Formik>
      </Container.Scroll>
      <Modal.Loading1 
        isVisible={isSubmit}/>
    </>
  )
}

export default EditProfile

const styles = StyleSheet.create({})
