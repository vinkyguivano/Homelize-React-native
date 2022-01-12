import React from 'react'
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import { backgroundPrimary } from '../assets'

const { width, height } = Dimensions.get('window')

export const Primary = ({ children, style }) => {
  return (
    <View style={[styles.Primary, style]}>
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

export const row = ({
            children,
            marginTop,
            marginRight, 
            marginLeft, 
            marginBottom, 
            marginVertical, 
            marginHorizontal,
            paddingHorizontal,
            paddingVertical,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
            justifyContent,
            alignItems,
            backgroundColor,
            flex,
            style }) => {
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: alignItems || 'center',
      justifyContent, 
      marginTop, 
      marginRight, 
      marginLeft, 
      marginBottom, 
      marginHorizontal, 
      marginVertical,
      paddingBottom,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingHorizontal,
      paddingVertical,
      backgroundColor,
      flex,
      ...style
      }}>
      {children}
    </View>
  )
}

export const Main = ({ 
            children, 
            marginHorizontal, 
            marginVertical, 
            marginBottom,
            marginRight,
            marginTop,
            marginLeft,
            paddingHorizontal, 
            paddingVertical,
            paddingTop,
            paddingBottom,
            paddingLeft,
            paddingRight,
            justifyContent,
            alignItems }) => {
  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: 'white', 
      marginTop, 
      marginRight, 
      marginLeft, 
      marginBottom, 
      marginHorizontal, 
      marginVertical,
      paddingBottom,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingHorizontal,
      paddingVertical,
      justifyContent,
      alignItems }}>
      {children}
    </View>
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

export const Scroll = ({children, refreshControl, scrollViewProps}) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        {...refreshControl && {refreshControl: refreshControl }}
        {...scrollViewProps}
        showsVerticalScrollIndicator={false}>
          <View style={{paddingTop: 20, paddingHorizontal: 20}}>
            {children}
          </View>
      </ScrollView> 
    </View>
  )
}
