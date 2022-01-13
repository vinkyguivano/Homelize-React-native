import React, { useContext, useEffect, useState } from 'react'
import { Button, Image, StyleSheet, TouchableNativeFeedback, View } from 'react-native'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import * as TextInput from '../../../../components/TextField'
import AuthContext from '../../../../context/AuthContext'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { api, color } from '../../../../utils'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { showMessage } from 'react-native-flash-message'
import * as Modal from '../../../../components/Modal'

const ProjectDetail = ({ navigation, route: { params } }) => {
  const { user: { user, token } } = useContext(AuthContext)
  const [images, setImages] = useState([])
  const [isSubmitting, setSubmitting] = useState(false)

  const onAddImage = () => {
    navigation.navigate('Project Image', {
      from: 'Project Detail'
    })
  }

  useEffect(() => {
    if (params?.data) {
      if (params?.isCreate) {
        const arr = [...images, params.data]
        setImages(arr)
      } else {
        const idx = images.findIndex(item => item.id === params.data.id)
        images[idx] = params.data
        const arr = [...images]
        setImages(arr)
      }
    }
  }, [params?.data])

  const validationSchema = Yup.object({
    name: Yup.string().trim()
      .required('Nama projek wajib diisi'),
    description: Yup.string().trim()
      .required('Deskripsi projek wajib diisi'),
    year: Yup.string().trim()
      .required('Tahun Projek wajib diisi')
      .length(4, 'Panjang 4 angka')
      .matches(/^\d+$/, 'Hanya bisa diisi angka')
  })

  const onImagePress = (item) => {
    navigation.navigate('Project Image', {
      projectImage: item,
      from: 'Project Detail'
    })
  }

  const onDeletePress = (value) => {
    const arr = images.filter((item) => item.id != value.id)
    setImages(arr)
  }

  const renderImages = images.length > 0 ?
    (images.map((item, index) => (
      <TouchableNativeFeedback key={index} onPress={() => onImagePress(item)}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image.uri }}
            style={styles.image} />
          <Text>{item.room.name}</Text>
          <Text numberOfLines={1}>{item.description}</Text>
          <TouchableNativeFeedback onPress={() => onDeletePress(item)}>
            <View style={styles.deleteButton}>
              <Text color={'white'}>Hapus</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </TouchableNativeFeedback>
    ))
    ) : null

  const onHandleSubmit = async (values) => {
    const { name, description, year } = values
    const projectImages = images.map((item) => {
      return ({
        description: item.description,
        style_id: item.design.id,
        room_id: item.room.id,
        budget_id: item.budget.id,
        maximum_budget: item.maximumBudget,
        minimum_budget: item.minimumBudget
      })
    })
    const body = {
      data: {
        name,
        description,
        year
      },
      images: projectImages
    }

    console.log(projectImages)

    try {
      setSubmitting(true)
      const { data } = await api.post(`v1/professionals/${user.id}/projects`, token, body)
      const { map_ids } = data
      const promises = []
      map_ids.forEach((item, index) => {
        const file = new FormData()
        file.append('image', {
          uri: Platform.OS === 'ios' ?
          images[index].image.uri.replace('file://', '')
          : images[index].image.uri,
          type: images[index].image.type,
          name: images[index].image.fileName
        })

        const promise = new Promise((res, rej) => {
          api.post(`v1/images/${item}`, token, file, {}, {
            'Content-Type': 'multipart/form-data'
          }).then((res1) => res(res1))
          .catch((err) => {
            console.log(err.response.data)
            rej(err.response.data)
          })
        }).catch(e => e)

        promises.push(promise)
      })

      await Promise.all(promises)
      console.log("images uploaded successfully")
      showMessage({
        message: "Projek telah berhasil ditambahkan",
        type: 'success'
      })

      navigation.navigate({
        name: 'Add Project',
        params: {
          refresh: true
        },
        merge: true
      })
    } catch (e) {
      console.log(e.response.data)
      showMessage({
        message: "Error " + e,
        type: 'danger'
      })
      setSubmitting(false)
    }
  }

  return (
    <>
      <Container.Scroll>
        <Formik
          initialValues={{
            name: '',
            description: '',
            year: ''
          }}
          validationSchema={validationSchema}
          onSubmit={(val) => onHandleSubmit(val)}
        >
          {({ handleChange, handleBlur, values, handleSubmit, touched, errors, ...props }) => (
            <View>
              <TextInput.Form
                label="Nama Projek"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name && errors.name}
                value={values.name}
              />
              <TextInput.Form
                label="Deskripsi Projek"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                error={touched.description && errors.description}
                value={values.description}
                multiline
              />
              <TextInput.Form
                label="Tahun Projek"
                onChangeText={handleChange('year')}
                onBlur={handleBlur('year')}
                error={touched.year && errors.year}
                value={values.year}
                keyboardType="numeric"
              />
              <Container.row>
                <Text flex={1}>Masukkan Gambar Projek</Text>
                <TouchableNativeFeedback onPress={onAddImage}>
                  <View>
                    <Icon name="plus" size={18} style={styles.icon} />
                  </View>
                </TouchableNativeFeedback>
              </Container.row>
              <View style={styles.imagesContainer}>
                {renderImages}
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  disabled={!values.description || !values.name || !values.year || images.length === 0}
                  title='Submit'
                  color={color.primary}
                  onPress={handleSubmit} />
              </View>
            </View>
          )}
        </Formik>
      </Container.Scroll>
      <Modal.Loading1 
        isVisible={isSubmitting}/>
    </>
  )
}

export default ProjectDetail

const styles = StyleSheet.create({
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  imageContainer: {
    width: '48%',
    marginTop: 16
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    marginBottom: 5
  },
  icon: {
    backgroundColor: color.primary,
    color: 'white',
    padding: 2,
    borderRadius: 20
  },
  buttonContainer: {
    marginTop: 35,
    marginBottom: 30
  },
  deleteButton: {
    backgroundColor: color.red,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginTop: 5
  }
})
