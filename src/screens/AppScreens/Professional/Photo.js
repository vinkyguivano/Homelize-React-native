import React, { useLayoutEffect } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Photo = ({ navigation, route: { params } }) => {
  const { data, from, isUpload } = params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  const onBackPress = () => navigation.goBack()
  const onUpload = () => {
    navigation.navigate({
      name: from,
      params: { image: data },
      merge: true
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <Icon name='arrow-left' size={28} color={'white'} />
        </TouchableWithoutFeedback>
        {
          isUpload && (
            <TouchableWithoutFeedback onPress={onUpload}>
              <Text style={styles.uploadText}>UPLOAD</Text>
            </TouchableWithoutFeedback>
          )
        }
      </View>
      <Image source={{ uri: data.uri }} style={styles.photo} />
    </View>
  )
}

export default Photo

const { height, window } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1
  },
  headerContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  uploadText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  photo: {
    width: '100%',
    height: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
    resizeMode: 'contain',
    maxHeight: height * (500 / height)
  }
})
