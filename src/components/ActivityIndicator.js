import React from 'react'
import { StyleSheet, Text, View, ActivityIndicator} from 'react-native'
import { color } from '../utils'

export default PrimaryIndicator = () => {
  return (
    <ActivityIndicator color={color.primary} size={'large'}/>
  )
}

const styles = StyleSheet.create({})
