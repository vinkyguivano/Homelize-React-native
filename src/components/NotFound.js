import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { notFound } from '../assets'
import { font } from '../utils';

const { height, width } = Dimensions.get('window');

export function Design({ label, styleContainer, styleImage, fontStyle }) {
  return (
    <View style={{
      marginTop: height * 0.087,
      justifyContent: 'center',
      alignItems: 'center',
      ...styleContainer
    }}>
      <Image source={notFound} style={{
        resizeMode: 'contain',
        width: width * 0.437,
        height: height * 0.263,
        ...styleImage
      }} />
      <Text
        style={{
          fontSize: 14,
          fontFamily: font.primary,
          color: 'black',
          textAlign: 'center',
          ...fontStyle
        }}>
        {label ? label : `
        Wah, hasil pencarian anda tidak tersedia
        Coba kata kunci lainnya`}
      </Text>

    </View>
  )
}

const styles = StyleSheet.create({})
