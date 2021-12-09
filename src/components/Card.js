import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { ParallaxImage } from 'react-native-snap-carousel';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { color, font } from '../utils';

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
            containerStyle = {styles.imageContainerProfessional}
            style = {styles.imageProfessional}
            parallaxFactor = {0.4}
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
            source={{uri: item.image_path}}
            containerStyle = {styles.imageContainerRoom}
            style = {styles.imageRoom}
            parallaxFactor = {0.4}
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
    textShadowOffset: {width: -2, height: 2},
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
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 10
  }
})
