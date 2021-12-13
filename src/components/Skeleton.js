import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const { width, height } = Dimensions.get('window')

export function Design() {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder>
        <View style={styles.image} />
      </SkeletonPlaceholder>
      <View style={styles.containerDesigProfName}>
        <SkeletonPlaceholder>
          <View style={{ marginBottom: 12, width: width * 0.243, height: height * 0.029 }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ borderRadius: 50, height: height * 0.036, width: width * 0.060 }} />
            <View style={{ marginLeft: 8, width: width * 0.243, height: height * 0.029 }} />
          </View>
        </SkeletonPlaceholder>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '48%',
    marginBottom: 18,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 1.5
  },
  containerDesigProfName: {
    margin: 12,
  },
})
