import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Button, Image, TouchableNativeFeedback } from 'react-native'
import AuthContext from '../../../../context/AuthContext'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import { api, color, storage } from '../../../../utils'
import { showMessage } from 'react-native-flash-message'
import Loading from '../../../../components/Loading'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Modal from '../../../../components/Modal'

const AddProject = ({ navigation, route: { params } }) => {
  const { user : data } = useContext(AuthContext)
  const { user, token } = data
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true)
        const { data } = await api.get(`professional/professionals/${user.id}`, token)
        const projects = data.projects || []
        setProjects(projects)
        setLoading(false)
      } catch (e) {
        showMessage({
          message: 'Error ' + e,
          type: 'danger'
        })
        setLoading(false)
      }
    }
    if (params?.refresh) {
      fetch()
      navigation.setParams({
        refresh: false
      })
    }
  }, [params?.refresh])

  useEffect(() => {
    navigation.setParams({
      refresh: true
    })
  }, [])

  const onAddProject = () => {
    navigation.navigate('Project Detail')
  }

  const onPressProject = (item) => {
    navigation.navigate('Edit Project', {
      projectId: item.id
    })
  }

  const renderProjects = projects && projects.length > 0 ? (
    <View>
      <Text style={styles.projectTitle}>Daftar Projek</Text>
      <View style={styles.imagesContainer}>
        {projects.map((item, idx) => (
          <TouchableNativeFeedback onPress={() => onPressProject(item)} key={idx}>
            <View style={styles.imageContainer}>
              <Container.row marginBottom={5}>
                <Text fontWeight={'bold'} flex={1}>{item.name}</Text>
              </Container.row>
              <Image
                source={{ uri: item.image_path }}
                style={styles.image} />
            </View>
          </TouchableNativeFeedback>
        ))}
      </View>
    </View>
  ) : null

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)
      await api.post(`v1/professionals/${user.id}/profile-completion`, token)
      const newData = {
        ...data,
        user: {
          ...user,
          status_id : 2
        }
      }
      await storage.storeData("client_data", newData)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home_P'}]
      })
    } catch (e) {
      showMessage({
        message: "Error " + e,
        type: 'danger'
      }) 
      setIsSubmitting(false) 
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Container.Main>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text>Anda dapat menambahkan portofolio projek untuk profil anda minimal 1</Text>
          <Container.row marginVertical={15}>
            <Text flex={1}>Tambah projek baru</Text>
            <TouchableNativeFeedback onPress={onAddProject}>
              <View>
                <Icon name="plus" size={18} style={styles.icon} />
              </View>
            </TouchableNativeFeedback>
          </Container.row>
          {renderProjects}
          {params?.firstRegister && (
            <View style={{ marginVertical: 15 }}>
              <Button
                color={color.primary}
                title='Submit'
                onPress={onSubmit} />
            </View>
          )}
        </View>
      </ScrollView>
      <Modal.Loading1 isVisible={isSubmitting} />
    </Container.Main>
  )
}

export default AddProject

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flex: 1
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  imageContainer: {
    width: '48%',
    marginBottom: 16
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  icon: {
    backgroundColor: color.primary,
    color: 'white',
    padding: 2,
    borderRadius: 20
  },
  projectTitle: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingBottom: 10,
    marginBottom: 10
  }
})
