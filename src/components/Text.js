import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { color, font } from '../utils'

export const Primary = ({children , style, ...props}) => {
  return (
    <Text style={{...styles.primary, ...style}} {...props}>
      {children}
    </Text>
  )
}

export const Title = ({children, style, ...props}) => {
  return(
    <Text style={{...styles.designTitle, ...style}} numberOfLines={2} {...props}>
      {children}
    </Text>
  )
}

export const Main = ({
            children, 
            fontFamily, 
            fontSize, 
            fontWeight,
            color,
            textAlign,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            marginHorizontal,
            marginVertical,
            paddingTop,
            paddingLeft,
            paddingRight,
            paddingBottom,
            paddingHorizontal,
            paddingVertical, 
            numberOfLines = 1,
            flex,
            fontStyle,
            onTextLayout}) => {
  return(
    <Text style={{ 
      fontFamily : fontFamily || font.secondary, 
      fontSize : fontSize || 14,
      color : color || 'black', 
      fontWeight,
      textAlign,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      marginHorizontal,
      marginVertical,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      paddingHorizontal,
      paddingVertical,
      fontStyle,
      flex
      }} 
      numberOfLines={ numberOfLines }
      {... onTextLayout ? onTextLayout={onTextLayout} : {}}>
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
  },
  designTitle: {
    fontFamily: font.primary,
    color: color.black,
    fontSize: 16,
    fontWeight: 'normal'
  },
  regular: {
    fontFamily: font.secondary,
    color: 'black',
    fontSize: 13
  },
})
