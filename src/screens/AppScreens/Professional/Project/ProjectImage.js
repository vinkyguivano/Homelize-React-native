import React, { useContext, useEffect, useState } from 'react'
import { Button, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import * as TextInput from '../../../../components/TextField'
import AuthContext from '../../../../context/AuthContext'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { api, color } from '../../../../utils'
import { showMessage } from 'react-native-flash-message'
import Loading from '../../../../components/Loading'
import * as Modal from '../../../../components/Modal'
import { rupiahFormat } from '../../../../utils'
import { launchImageLibrary } from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ProjectImage = ({ navigation, route }) => {
  const selectedData = route.params?.projectImage || ''
  const { user: { user, token } } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState({
    rooms: [],
    budgets: [],
    designs: []
  })
  const [image, setImage] = useState(selectedData.image || '')
  const [isRoomModalOpen, setRoomModalOpen] = useState(false)
  const [isDesignModalOpen, setDesignModalOpen] = useState(false)
  const [isEditPhoto, setIsEditPhoto] = useState(false)

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true)
        const { data } = await api.get('design/filters', token)
        const { rooms, budgets, designs } = data
        const nominal = [100000000, 500000000, 2000000000, '']
        const budgetNominal = budgets.map((item, id) => {
          item.nominal = nominal[id]
          return item
        })
        setOptions({ rooms, budgets: budgetNominal, designs })
        setLoading(false)
      } catch (e) {
        showMessage({
          message: 'Error ' + e,
          type: 'danger'
        })
        setLoading(false)
      }
    }

    fetch()
  }, [])

  const onUploadPhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
        showMessage({
          message: 'Error ' + response.errorCode,
          type: 'danger'
        })
      } else {
        navigation.navigate('Photo', {
          data: response.assets[0],
          from: 'Project Image',
          isUpload: true
        })
      }
    })
  }

  const onViewImage = () => {
    navigation.navigate('Photo', { data: { uri: image.uri }, from: 'Project Image' })
  }

  useEffect(() => {
    if (route.params?.image) {
      setImage(route.params.image)
      setIsEditPhoto(true)
    }
  }, [route.params?.image])

  const validationSchema = Yup.object({
    description: Yup.string().trim()
      .required('Deskripsi gambar wajib diisi')
      .max(256, 'Maksimal karakter 256'),
    design: Yup.object()
      .required('Kategori desain wajib dipilih'),
    room: Yup.object()
      .required('Kategori ruangan wajib dipilih'),
    minimumBudget: Yup.string()
      .required('minimum wajib diisi'),
    maximumBudget: Yup.string()
      .required('maksimum wajib diisi')
      .test('is-greater-than-mininmum', "maksimum harus lebih besar dari minimum", function (value) {
        const { minimumBudget } = this.parent;
        if (value != undefined && minimumBudget != undefined) {
          let max = parseInt(value.replace(/\./g, ''))
          let min = parseInt(minimumBudget.replace(/\./g, ''))
          return max > min
        } else {
          return true;
        }
      })
  })

  const onSubmit = (val) => {
    const { description, design, room, maximumBudget, minimumBudget } = val
    const maxBudget = isNaN(maximumBudget) ? parseInt(maximumBudget.replace(/\./g, '')) : maximumBudget
    , minBudget =  isNaN(minimumBudget) ?  parseInt(minimumBudget.replace(/\./g, '')) : minimumBudget
    
    const budget = options.budgets.find((item, index) => {
      if (maxBudget <= item.nominal || index === 3) {
        return true
      }
    })

    const data = {
      description: description,
      design: design,
      room: room,
      maximumBudget: maxBudget,
      minimumBudget: minBudget,
      image: image,
      budget: budget
    }

    let params
    if (!selectedData) {
      const id = Date.now()
      const projectImage = {
        id,
        ...data,
        newImage: true,
        editImage: isEditPhoto ? true: false
      }
      params = {
        data: projectImage,
        isCreate: true
      }
    } else {
      const projectImage = {
        ...selectedData,
        ...data,
        editImage: isEditPhoto ? true: false
      }

      params = {
        data: projectImage,
        isCreate: false
      }
    }

    navigation.navigate({
      name: route.params.from,
      params: params,
      merge: true
    })
  }

  if (loading) return <Loading />

  return (
    <>
      <Container.Scroll>
        <Formik
          initialValues={{
            description: selectedData.description || '',
            design: selectedData.design || '',
            room: selectedData.room || '',
            maximumBudget: selectedData.maximumBudget || '',
            minimumBudget: selectedData.minimumBudget || ''
          }}
          validationSchema={validationSchema}
          onSubmit={(val) => onSubmit(val)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, ...props }) => (
            <View>
              <View marginBottom={30}>
                <TouchableOpacity onPress={onUploadPhoto}>
                  <Container.row >
                    <Icon name="image" size={25} />
                    <Text marginLeft={7} fontSize={15}>{image ? 'Ubah' : 'Upload'} gambar</Text>
                  </Container.row>
                </TouchableOpacity>
                {
                  image ?
                    <TouchableOpacity onPress={onViewImage}>
                      <View style={{ marginTop: 10, alignItems: 'center' }}>
                        <Image
                          source={{ uri: image.uri }}
                          style={{
                            width: width * 250 / width,
                            aspectRatio: 1
                          }} />
                      </View>
                    </TouchableOpacity> : null
                }
              </View>
              <TextInput.Form
                label="Deskripsi gambar"
                value={values.description}
                error={touched.description && errors.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                multiline
              />
              <TextInput.Form
                label="Kategori Ruangan"
                value={values.room.name}
                editable={false}
                error={touched.room && errors.room}
                onDropdownPress={() => setRoomModalOpen(true)}
                dropdown
              />
              <Modal.Form
                isVisible={isRoomModalOpen}
                label={"Kategori Ruangan"}
                optionList={options.rooms}
                toggleModal={() => setRoomModalOpen(!isRoomModalOpen)}
                selectedOption={values.room}
                onBlur={() => props.setFieldTouched('room', true)}
                onChange={(val) => props.setFieldValue('room', val)} />
              <TextInput.Form
                label="Kategori Desain"
                editable={false}
                value={values.design.name}
                error={touched.design && errors.design}
                onDropdownPress={() => setDesignModalOpen(true)}
                dropdown
              />
              <Modal.Form
                isVisible={isDesignModalOpen}
                label={"Kategori Desain"}
                optionList={options.designs}
                toggleModal={() => setDesignModalOpen(!isDesignModalOpen)}
                selectedOption={values.design}
                onBlur={() => props.setFieldTouched('design', true)}
                onChange={(val) => props.setFieldValue('design', val)} />
              <View>
                <Text fontSize={15} marginBottom={10}>Estimasi Budget</Text>
                <Container.row alignItems={'flex-start'}>
                  <TextInput.Form
                    placeholder="Minimum"
                    onChangeText={handleChange('minimumBudget')}
                    onBlur={handleBlur('minimumBudget')}
                    error={touched.minimumBudget && errors.minimumBudget}
                    value={rupiahFormat(values.minimumBudget)}
                    keyboardType="numeric"
                    prefix={'Rp'}
                    flex={.4} />
                  <Text marginHorizontal={10} marginTop={5}>-</Text>
                  <TextInput.Form
                    placeholder="Maksimum"
                    onChangeText={handleChange('maximumBudget')}
                    onBlur={handleBlur('maximumBudget')}
                    error={touched.maximumBudget && errors.maximumBudget}
                    value={rupiahFormat(values.maximumBudget)}
                    keyboardType="numeric"
                    prefix={'Rp'}
                    flex={.4} />
                </Container.row>
              </View>
              <View style={{ marginBottom: 20, marginTop: 10 }}>
                <Button
                  disabled={!image || !values.description || !values.design || !values.maximumBudget || !values.minimumBudget}
                  onPress={handleSubmit}
                  color={color.primary}
                  title="Submit" />
              </View>
            </View>
          )}
        </Formik>
      </Container.Scroll>
    </>
  )
}

export default ProjectImage

const styles = StyleSheet.create({})
const { width, height } = Dimensions.get('window')