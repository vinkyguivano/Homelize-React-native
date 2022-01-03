import React, { memo } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements';
import { ParallaxImage } from 'react-native-snap-carousel';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { color, font } from '../utils';
import * as TextM from './Text'
import { profile } from '../assets/index'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { rupiahFormat } from '../utils';

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

export const Design = memo(({ item, index, navigation, type, onUnlikedImage }) => {
  // console.log(index)
  const imageSource = item.professional_image ?
    { uri: item.professional_image } : profile

  return (
    <TouchableNativeFeedback onPress={() => navigation.navigate('Design Detail', {id : item.id})}>
      <View style={styles.designItemContainer}>
        <View>
          <Image
            source={{ uri: item.image_path }}
            style={styles.designImage} />
          { type === "Liked Image" && (
            <TouchableNativeFeedback onPress={()=>onUnlikedImage(item.id, index)}>
              <View style={styles.heartContainer}>
                <Icon name='heart' size={18} color={'rgba(255,0,0,1)'} />
              </View>
            </TouchableNativeFeedback>
          )}
        </View>
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
    </TouchableNativeFeedback>
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
    aspectRatio: 16 / 9,
    borderRadius: 8,
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
    marginBottom: 20,
    elevation: 8,
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
  },
  heartContainer : {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: 'rgba(0,0,0,.7)',
    height: width * 0.0729,
    width: width * 0.0729,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.0729
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

export const Professional = memo(({ item, index, navigation }) => {
  let rating;
  if (item.total_rating) {
    let [a, b] = item.total_rating.split('.')
    a = parseInt(a), b = parseInt(b)
    
    if (b <= 2) {
      b = 0
    } else if (b >= 8) {
      b = 0
      a += 1
    } else {
      b = 5
    }

    let array = [];
    
    for(let i = 0 ; i < a ; i++ ){
      array.push(<Icon name="star" size={18} key={i} color={'#ebb61b'}/>)
    }
    if(b === 5) array.push(<Icon name="star-half-full" size={18} color={'#ebb61b'} />)

    rating = (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
      {array}
      <Text style={{fontFamily: font.primary, fontSize: 12, color: 'black', marginLeft: 4}}>{item.total_rating}</Text>
    </View>
    )

  } else {
    rating = <Text style={{fontFamily: font.primary, fontSize: 13, fontStyle: 'italic', color: 'black'}}>No Rating</Text>
  }

  return (
    <TouchableNativeFeedback onPress={()=>navigation.navigate('Professional Detail', { id : item.id })}>
      <View style={stylesProfessional.container}>
        <Image
          source={{ uri: item.thumbnail }}
          style={stylesProfessional.image}
        />
        <View style={stylesProfessional.infoBox}>
          <View style={stylesProfessional.nameBox}>
            <Image source={{ uri: item.image_path }} style={stylesProfessional.avatar} />
            <Text style={stylesProfessional.name} numberOfLines={1}>{item.name}</Text>
          </View>
          <View style={stylesProfessional.nameBox}>
            {rating}
          </View>
          <View style={stylesProfessional.nameBox}>
            <Icon name='map-marker-outline' size={18} style={{marginRight: 5, color: 'black'}} />
            <Text style={stylesProfessional.address} numberOfLines={1}>{item.city_name}, {item.province_name}</Text>
          </View>
          <View>
            <Text style={stylesProfessional.address}>{item.type_name}</Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
})

const stylesProfessional = StyleSheet.create({
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
    resizeMode: 'cover',
  },
  infoBox: {
    marginVertical: 10,
    marginHorizontal: 12,
    flex: 1,
  },
  nameBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9
  },
  avatar: {
    width: width * 0.0583,
    height: width * 0.0583,
    borderRadius: width * 0.0583,
    marginRight: 8
  },
  name: {
    fontFamily: font.primary,
    fontSize: 14,
    flex: 1,
    color: color.black
  },
  address: {
    flex: 1,
    fontFamily: font.primary,
    fontSize: 10,
    color: color.black,
  }
})

export const CityItem = ({ item, onPress, selectedItem }) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={style1.container}>
        <Text style={style1.itemText}>{item.name}, {item.province_name}</Text>
        <Icon 
          name={selectedItem ? "checkbox-marked" : "checkbox-blank-outline"} 
          size={23}
          color={selectedItem ? color.primary: 'darkgrey'} />
      </View>
    </TouchableNativeFeedback>
  )
}

const style1 = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: height * 0.0198,
    marginRight: 8,
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 0.7,
    paddingBottom: height * 0.0198,
    justifyContent: 'space-between'
  },
  itemText:{
    fontFamily: font.secondary,
    fontSize: 14,
  }
})

export const Review = memo(({ item, type, index }) => {
  const stars = Array.from({length : item.rating}, (_, i) => (
    <Icon name="star" size={18} key={i} color={'#ebb61b'}/>
  ))

  return (
    <View style={{...stylesReview.container, ... type === "modal" && { padding : 20 }}}>
      <TextM.Main marginBottom={5}>{item.username}</TextM.Main>
        <View style={stylesReview.starContainer}>
          {stars}
        </View>
        <TextM.Main marginTop={15} numberOfLines={0} textAlign={'justify'}>{item.review}</TextM.Main>
    </View>
  )
})

const stylesReview = StyleSheet.create({
  starContainer: {
    flexDirection:'row',
    alignItems: 'center'
  },
  container: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingVertical: 15
  }
})

export const Package = ({ item, onPress, selectedPaket }) => {
  return (
    <>
      <View style={{...stylesPackage.container, ... selectedPaket.id === item.id && {borderColor: color.primary, borderWidth: 1.5 }}}>
        <View style={{padding: 20}}>
          <TextM.Main fontSize={16} marginBottom={5}>{item.name.toUpperCase()}</TextM.Main>
          <TextM.Main numberOfLines={0} lineHeight={23} marginBottom={10}>
            {item.desc}
          </TextM.Main>
          <TextM.Main fontSize={16}>Rp {rupiahFormat(item.price)} / m²</TextM.Main>
        </View>
        <TouchableNativeFeedback onPress={() => onPress(item)}>
          <View style={stylesPackage.buttonContainer}>
            <Text style={stylesPackage.selectText}>Pilih</Text>
          </View>
        </TouchableNativeFeedback>
        {
          selectedPaket.id === item.id && (
            <View style={stylesPackage.iconContainer}>
              <Icon name="checkbox-marked-circle-outline" size={25} color={color.primary}/>
            </View>
          )
        }
      </View>
    </>
  )
}

const stylesPackage = StyleSheet.create({
  container:{
    borderRadius: 10,
    elevation: 8,
    backgroundColor: 'white',
    marginTop: 15,
    width: width * 0.7299,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  buttonContainer: {
    borderColor: 'lightgrey',
    borderTopWidth: 1,
    paddingVertical: 10
  },
  selectText: {
    fontSize: 14,
    color: color.primary,
    textAlign: 'center',
    fontFamily: font.secondary,
    fontWeight: 'bold'
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
    top: 20
  }
})