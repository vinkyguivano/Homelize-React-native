import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { color, font } from '../utils'

export const Primary = ({ children , style}) => {
  return (
    <Text style={{...styles.primary, ...style}}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  primary: {
    fontFamily: font.primary,
    fontWeight: 'bold',
    color: color.white,
    fontSize: 18,
  }
})
