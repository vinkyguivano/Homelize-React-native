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
      {/* <View style={styles.containerDesigProfName}>
        <SkeletonPlaceholder>
          <View style={{ marginBottom: 12, width: width * 0.243, height: height * 0.029 }} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ borderRadius: 50, height: height * 0.036, width: width * 0.060 }} />
            <View style={{ marginLeft: 8, width: width * 0.243, height: height * 0.029 }} />
          </View>
        </SkeletonPlaceholder>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '48%',
    marginBottom: 26,
    borderRadius: 5,
    elevation: 8
  },
  image: {
    width: '100%',
    aspectRatio: 1.3
  },
  containerDesigProfName: {
    margin: 12,
  },
})

export function Professional(){
  return (
    <View style={stylesP.container}>
      <SkeletonPlaceholder>
        <View style={stylesP.image} />
      </SkeletonPlaceholder>
      <View style={stylesP.infoBox}>
        <SkeletonPlaceholder>
          <View style={{flexDirection: 'row', marginBottom: 9,}}>
            <View style={stylesP.avatar}/>
            <View style={{height: 20, width: 100}}/>
          </View>
          <View style={stylesP.item}/>
          <View style={stylesP.item}/>
        </SkeletonPlaceholder>
      </View>
    </View>
  )
}

const stylesP = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 20,
    elevation: 8,
  },
  image: {
    width: width * 0.3527,
    aspectRatio: 1.08,
  },
  infoBox: {
    marginVertical: 10,
    marginHorizontal: 12,
    flex: 1,
  },
  item: {
    marginBottom: 9,
    height: 20,
    width: '90%'
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 8
  },
})
