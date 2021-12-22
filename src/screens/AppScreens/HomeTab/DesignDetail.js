import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import AuthContext from '../../../context/AuthContext'
import { showMessage } from 'react-native-flash-message'
import { api, color, font } from '../../../utils'
import { capitalize } from '../../../utils'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ActivityIndicator from '../../../components/ActivityIndicator'

const { width, height } = Dimensions.get('window')

const DesignDetail = ({ route, navigation }) => {
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)
  const scrollViewRef = useRef(null)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const fetchData =  async () =>  {
    try {
      const { id } = route.params
      const { data } = await api.get(`design/images/${id}`, user.token)
      setImage(data)
      setIsLiked(data.is_liked ? true : false)
    } catch (error) {
      setError(`${error}`)
    }
  }
  

  const onRefresh = async() => {
    setRefresh(true)
    await fetchData()
    setRefresh(false)
  }

  useEffect(() => {
    async function mount(){
      setLoading(true)
      setRefresh(true)
      await fetchData()
      setLoading(false)
      setRefresh(false)
    }

    mount()
   
  }, [route.params.id])

  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger'
      })
    }
  }, [error])

  const onLikeImage = async(imageId) => {
    try {
      await api.post('design/user/images', user.token, { "image_id" : imageId})
      setIsLiked(true)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const onDislikeImage = async(imageId) => {
    try {
      await api.delete(`design/user/images/${imageId}`, user.token)
      setIsLiked(false)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const otherImages = image.project?.related_images ?
    (
      image.project.related_images.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            navigation.navigate('Design Detail', { id: item.id })
            scrollViewRef.current.scrollTo({
              y: 0,
              animated: false
            })
          }}>
          <View style={{
            marginRight: 20,
          }}>
            <Image
              source={{ uri: item.image_path }}
              style={{ aspectRatio: 1.5, width: width * 0.4866 }} />
          </View>
        </TouchableOpacity>
      ))
    )
    : []
  
  
  if(loading && !image){
    return (
      <View style={{flex : 1, backgroundColor: 'white', justifyContent:'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refresh}
            onRefresh={onRefresh}/>
        }
        ref={scrollViewRef}>
        <Image
          fadeDuration={0}
          source={{ uri: image.image_path }}
          style={{ width: '100%', aspectRatio: 4 / 3, resizeMode: 'stretch' }} />
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.title}>{capitalize(image.project?.name)}</Text>
            <TouchableWithoutFeedback onPress={() => isLiked ? onDislikeImage(image.id) : onLikeImage(image.id) }>
              <Icon name={isLiked ? "heart" : "heart-outline"} size={23}c color={isLiked ? 'red' :'#000000'}/>
            </TouchableWithoutFeedback>
          </View>
          <Text style={styles.type}>{image.room?.name} {image.style?.name}</Text>
          <Text style={styles.type}>Budget : Rp 1.000.000 - Rp 5.0000</Text>
          <Text style={{...styles.type, marginBottom: 15}}>{image.description}</Text>
          <View style={styles.bar} />
          <View style={{ marginTop: 15, marginBottom: 25 }}>
            <Text style={styles.designedBy}>Dirancang oleh :</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image
                  source={{ uri: image.professional?.image_path }}
                  style={{ width: 40, height: 40, borderRadius: 40 }} />
                <View style={{ marginLeft: 10, maxWidth: '70%'}}>
                  <Text
                    style={styles.professionalName}
                    numberOfLines={1}>
                    {image.professional?.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '100%' }}>
                    <Icon name='map-marker-outline' size={16} style={{ marginRight: 3, color: 'black' }} />
                    <Text
                      style={styles.cityName}
                      numberOfLines={1}>
                      {image.professional?.city}, {image.professional?.province}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Professional Detail', { id : image.professional?.id})}>
                <Text style={styles.visitProfile}>Kunjungi Profil</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bar} />
        </View>
        {image.project?.related_images ?
          <View style={{ marginLeft: 20, marginBottom: 30 }}>
            <Text style={{ ...styles.designedBy, marginBottom: 13 }}>Gambar lainnya di projek {capitalize(image.project?.name)}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}>
              {otherImages}
            </ScrollView>
          </View> : null
        }
      </ScrollView>
    </View>
  )
}

export default DesignDetail

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    color: 'black',
    fontSize: 17,
    marginBottom: 13,
    fontWeight: 'bold',
    fontFamily: font.secondary
  },
  type: {
    color: 'black',
    fontSize: 14,
    marginBottom: 13,
    fontFamily: font.secondary,
    textAlign: 'justify'
  },
  designedBy: {
    fontSize: 14,
    color: 'black',
    fontWeight: '700',
    fontFamily: font.secondary,
    marginBottom: 10
  },
  bar: {
    height: 1,
    backgroundColor: 'lightgrey',
  },
  visitProfile: {
    color: color.primary,
    fontWeight: 'bold',
    fontFamily: font.secondary,
    fontSize: 12
  },
  professionalName: {
    fontFamily: font.secondary,
    color: 'black',
    fontSize: 13,
    marginBottom: 4
  },
  cityName: {
    fontFamily: font.secondary,
    color: 'black',
    fontSize: 12
  }
})
