import React from 'react'
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { backgroundPrimary } from '../assets'

const { width, height } = Dimensions.get('window')

export const Primary = ({ children, style }) => {
  return (
    <View style = {[styles.Primary, style ]}>
      {children}
    </View>
  )
}

export const GreenBackGround = ({ children }) => {
  return (
    <ImageBackground source={backgroundPrimary} style={styles.headerBackground}>
      {children}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  Primary: {
    paddingHorizontal: 30
  },
  headerBackground: {
    width: width,
    height: height * 0.36,
  },
})
