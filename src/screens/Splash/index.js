import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import color from '../../utils/color'

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login')
    }, 3000)
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
