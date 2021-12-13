import React, { memo } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { color, font } from '../utils';
import * as TextM from './Text'
import { profile } from '../assets/index'

const { width, height } = Dimensions.get('window')

export const Home = ({ item, type, onPress, ...props }) => {
  let card

  switch (type) {
    case 'Banner': {
      card = (
        <View style={styles.item}>
          <ParallaxImage
            source={item.imgSource}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.4}
            {...props}
          />
        </View>
      )
      break;
    }
    case 'Professional': {
      card = (
        <View style={styles.itemProfessional}>
          <ParallaxImage
            source={item.image}
            containerStyle={styles.imageContainerProfessional}
            style={styles.imageProfessional}
            parallaxFactor={0.4}
            {...props}
          />
          <Text style={styles.professionalType}>{item.name}</Text>
        </View>
      )
      break;
    }
    case 'Design': {
      card = (
        <View style={styles.itemRooms}>
          <ParallaxImage
            source={{ uri: item.image_path }}
            containerStyle={styles.imageContainerRoom}
            style={styles.imageRoom}
            parallaxFactor={0.4}
            {...props}
          />
          <Text style={styles.roomCategory}>{item.name}</Text>
        </View>
      )
      break;
    }
  }
  return (
    <Pressable onPress={onPress}>
      {card}
    </Pressable>
  )
}

export const Design = memo(({ item, index }) => {
  // console.log(index)
  const imageSource = item.professional_image ?
    { uri: item.professional_image } : profile

  return (
    <View style={styles.designItemContainer}>
      <Image
        source={{ uri: item.image_path }}
        style={styles.designImage} />
      <View style={{ margin: 10 }}>
        <TextM.Title>{item.project_name}</TextM.Title>
        <View style={styles.containerDesigProfName}>
          <Avatar rounded source={imageSource} containerStyle={styles.avatarContainer} />
          <TextM.Title
            style={styles.designProfName}>
            {item.professional_name}
          </TextM.Title>
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  item: {
    width: width - 60,
  },
  imageContainer: {
    width: width - 60,
    aspectRatio: 16 / 9,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
    aspectRatio: 16 / 9
  },
  itemProfessional: {
    width: width * 0.83 - 60,
  },
  imageContainerProfessional: {
    aspectRatio: 1.6,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    borderRadius: 8,
  },
  imageProfessional: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  professionalType: {
    position: 'absolute',
    bottom: 10,
    fontFamily: font.secondary,
    color: color.white,
    fontWeight: 'bold',
    fontSize: 20,
    left: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10
  },
  itemRooms: {
    width: width * 0.83 - 60,
  },
  imageContainerRoom: {
    aspectRatio: 1.6,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    borderRadius: 8,
  },
  imageRoom: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  roomCategory: {
    position: 'absolute',
    bottom: 10,
    fontFamily: font.secondary,
    color: color.white,
    fontWeight: 'bold',
    fontSize: 20,
    left: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10
  },
  designItemContainer: {
    width: '48%',
    marginBottom: 18,
    borderWidth: 0.5,
    borderColor: 'darkgrey',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: color.white
  },
  designImage: {
    width: '100%',
    aspectRatio: 1.5
  },
  containerDesigProfName: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  designProfName: {
    fontSize: 12,
    fontFamily: font.secondary,
    marginLeft: 8,
    flex: 1
  },
  avatarContainer: {
    width: 20,
    height: 20,
  }
})

export const FilterItem = ({ item, onPress, selectedItem }) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={[stylesFilterItem.itemContainer, selectedItem && { borderColor: color.primary }]}>
        <Text style={[stylesFilterItem.itemText, selectedItem && { color: color.primary }]}>
          {item.name}
        </Text>
      </View>
    </TouchableNativeFeedback>
  )
}

const stylesFilterItem = StyleSheet.create({
  itemContainer: {
    borderWidth: 1,
    borderColor: 'darkgrey',
    borderRadius: 14,
    padding: 9,
    marginTop: height * 0.0161,
    marginRight: width * 0.0267,
  },
  itemText: {
    fontSize: 12,
    fontFamily: font.secondary
  }
})