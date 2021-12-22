import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ActivityIndicator from './ActivityIndicator'

const Loading = () => {
  return (
    <View style={{flex : 1, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
      <ActivityIndicator />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})
