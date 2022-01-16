import React, { useState, useEffect, useContext } from 'react'
import { Dimensions, Image, StyleSheet, TouchableNativeFeedback, View } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from 'react-native-google-signin'
import AuthContext from '../../../../context/AuthContext'
import { api, color } from '../../../../utils'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import { showMessage } from 'react-native-flash-message'
import Loading from '../../../../components/Loading'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { width, height } = Dimensions.get('window')

const Profile = ({ navigation }) => {
  const { user, signOut } = useContext(AuthContext)
  const [userData, setUserData] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchUserData()
        GoogleSignin.configure({
          webClientId: "786926213150-jc9vhgr8o97sth41fbvii1ttdoo9k31k.apps.googleusercontent.com"
        })
      } catch (e) {
        console.log(e);
      }
    }

    fetchData()
  }, [])

  const fetchUserData = async() => {
    try{
      setLoading(true)
      const { data } = await api.get(`users/${user.user.id}`, user.token);
      setUserData(data)
      setLoading(false)
    }catch(e){
      showMessage({
        message: 'error ' + e,
        type: 'danger'
      })
      setLoading(false)
    }
  }

  const onLogout = async () => {
    try {
      await api.post('logout', user.token)

      if (user.provider === "facebook") {
        await LoginManager.logOut();
      }
      if (user.provider === "google") {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }

      await signOut()

    } catch (error) {
      alert('Terjadi kesalahan, gagal logout')
      console.log(error);
    }
  }

  const onPressFavorite = () => {
    navigation.navigate('Liked Images')
  }

  const onPressEditProfile = () => {
    navigation.navigate('Edit Profile',{
      data: userData,
      onGoBack: () => fetchUserData()
    })
  }

  if (loading) return <Loading />

  return (
    <View style={{ flex: 1 }}>
      <Container.Main>
        <View style={{alignItems: 'center'}}>
          <View style={styles.topContainer}>
            <Image
              source={{uri: userData.image_path}}
              style={styles.profileImage}/>
            <Text style={styles.name}>{userData.name}</Text>
          </View>
          <View style={styles.menuContainer}>
            <TouchableNativeFeedback onPress={onPressEditProfile}>
              <View style={styles.menuItemContainer}>
                <Text fontSize={15}>Edit Profile</Text>
                <Icon name="chevron-right" size={20}/>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={onPressFavorite}>
              <View style={styles.menuItemContainer}>
                <Text fontSize={15}>Favorit Saya</Text>
                <Icon name="chevron-right" size={20}/>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={onLogout}>
              <View style={styles.menuItemContainer}>
                <Text fontSize={15}>Keluar</Text>
                <Icon name="logout" size={20}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Container.Main>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: color.primary,
    width: width,
    height: height * 0.3109,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  profileImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 17,
    marginVertical: 20
  },
  menuContainer: {
    marginTop: 20,
    width: width,
    backgroundColor: 'white',
    elevation: 8,
  },
  menuItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
