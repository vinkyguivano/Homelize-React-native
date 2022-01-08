import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LoginManager } from 'react-native-fbsdk'
import { GoogleSignin } from 'react-native-google-signin'
import { PrimaryButton } from '../../../../components'
import AuthContext from '../../../../context/AuthContext'
import { api, storage } from '../../../../utils'

const Profile = () => {
  const [user , setUser] = useState('');
  const { signOut } = React.useContext(AuthContext)

  useEffect(() => {
    async function fetchData(){
      try{
        GoogleSignin.configure({
          webClientId: "786926213150-jc9vhgr8o97sth41fbvii1ttdoo9k31k.apps.googleusercontent.com"
        })

        const { token, user, provider } = await storage.getData('client_data');
        setUser({
          ...user,
          provider,
          token
        })
      }catch (e) {
        alert('Terjadi kesalahan')
      }
    }

    fetchData()
  }, [])

  const onLogout = async() => {
    try {
      await api.post('logout', user.token)

      if(user.provider === "facebook"){
        await LoginManager.logOut();
      }
      if(user.provider === "google"){
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      
      await signOut()

    } catch (error) {
      alert('Terjadi kesalahan, gagal logout')
      console.log(error);
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Hello {user?.name}</Text>
      <PrimaryButton title="Log Out" onPress={onLogout} width={320}/>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})
