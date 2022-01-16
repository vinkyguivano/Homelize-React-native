import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, ImageBackground, Dimensions, Image, TouchableNativeFeedback, Alert } from 'react-native'
import * as Container from '../../../components/Container'
import AuthContext from '../../../context/AuthContext'
import { Main as Text } from '../../../components/Text'
import { api } from '../../../utils'
import { showMessage } from 'react-native-flash-message'
import Loading from '../../../components/Loading'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { width, height } = Dimensions.get('window')

const Profile = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const { user: { user, token }, signOut } = useContext(AuthContext)
  const [professional, setProfessional] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile= async() => {
    try {
      setLoading(true)
      const { data } = await api.get(`professional/professionals/${user.id}`, token)
      setProfessional(data)
      setLoading(false)
    } catch (e) {
      showMessage({
        message: 'Error ' + e,
        type: 'danger'
      })
      setLoading(false)
    }
  }

  const onLogout = () => {
    Alert.alert("Alert", "Apakah anda yakin ingin keluar ?", [
      {
        text: 'Tidak'
      },
      {
        text: 'Ya',
        onPress: handleLogout
      }
    ], { cancelable: true })
  }

  const handleLogout = async () => {
    try {
      await api.post('logout', token);
      await signOut()
    } catch (e) {
      showMessage({
        message: "Error " + e,
        type: 'danger'
      })
    }
  }

  const onPressUpdateProfile = () => {
    navigation.navigate('Edit Profile', {
      onGoBack : () => fetchProfile()
    })
  }

  const onPressUpdateProjek = () => {
    navigation.navigate('Add Project')
  }

  if (loading) return <Loading />

  return (
    <Container.Main>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <ImageBackground
            source={{ uri: professional.cover_pic }}
            style={styles.imgBackground} />
          <View style={styles.profileImageContainer}>
            <TouchableNativeFeedback onPress={() => 
              navigation.navigate('Photo', { 
                data: { uri : professional.profile_pic, 
                from: 'Profile'
              }})}>
              <Image
                source={{ uri: professional.profile_pic }}
                style={styles.profileImage} />
            </TouchableNativeFeedback>
          </View>
          <Text style={styles.professionalName}>{professional.name}</Text>
          <View style={styles.menuContainer}>
            <TouchableNativeFeedback onPress={onPressUpdateProfile}>
              <View style={styles.menuItemContainer}>
                <Text>Update Profile</Text>
                <Icon name="chevron-right" size={20} color={'#000000'} />
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={onPressUpdateProjek}>
              <View style={styles.menuItemContainer}>
                <Text>Update Projek</Text>
                <Icon name="chevron-right" size={20} color={'#000000'} />
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={onLogout}>
              <View style={styles.menuItemContainer}>
                <Text>Logout</Text>
                <Icon name="logout" size={20} color={'#000000'} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </ScrollView>
    </Container.Main>
  )
}

export default Profile

const styles = StyleSheet.create({
  imgBackground: {
    width: width,
    height: height * (220 / height)
  },
  profileImage: {
    width: width * (140 / width),
    height: width * (140 / width),
    borderRadius: width * (140 / width),
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: - width * (80 / width)
  },
  professionalName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 6
  },
  menuContainer: {
    backgroundColor: 'white',
    width: width - 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    marginTop: 20
  },
  menuItemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
