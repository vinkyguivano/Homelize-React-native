import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { color, storage } from '../../utils'

const Splash = ({ navigation }) => {

  const checkAuth = async () => {
    try {
      const res = await storage.getData("client_data");
      if(res?.token && res?.user){
        navigation.replace('App');
      }else{
        navigation.replace('Auth');
      }
    } catch (error){
      console.log(error)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      checkAuth()
    }, 2000)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.font}>HOMELIZE</Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  font: {
    fontFamily: 'DMSans-Regular',
    fontWeight: 'bold',
    fontSize: 35,
    color: color.primary
  }
})
