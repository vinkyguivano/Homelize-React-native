import React, { useState, useEffect } from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { banner1, banner2, architect, interior } from '../../../assets'
import { api, color, font, storage } from '../../../utils'
import * as Container from '../../../components/Container'
import * as HText from '../../../components/Text'
import * as Carousel from '../../../components/Carousel'
import * as Card from '../../../components/Card'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { showMessage } from 'react-native-flash-message'

const Home = ({ navigation }) => {
  const [user, setUser] = useState('')
  const [roomCategory, setRoomCategory] = useState([])
  const [carousel, setCarousel] = useState({
    activeIndex: 0,
    carouselItems: [
      {
        imgSource: banner1,
        destination: 'Design',
      },
      {
        imgSource: banner2,
        destination: 'Profile'
      }
    ]
  })
  const [errorMsg, setErrorMsg] = useState('');

  const [professionalTypes, setProfessionalTypes] = useState([
    {
      id: 1,
      name: 'Arsitek',
      image: architect
    },
    {
      id: 2,
      name: 'Desainer Interior',
      image: interior
    }
  ])

  useEffect(() => {
    async function fetchData() {
      try {
        data = await storage.getData("client_data")
        setUser({
          ...data.user,
          token: data.token
        })
        let { data: rooms } = await api.get('design/rooms', data.token)
        setRoomCategory(rooms)
      } catch (e) {
        setErrorMsg("Terjadi kesalahan")
      }
    }

    fetchData();
  }, [])

  useEffect(() => {
    if(errorMsg){
      showMessage({
        message: errorMsg,
        type: 'danger'
      })
    }
  }, [errorMsg])


  const renderBannerItem = ({ item, index }, parallaxProps) => {
    return (
      <Card.Home
        item={item}
        onPress={() => {
          navigation.navigate("Catalogue", {
            screen: item.destination
          })
        }}
        type="Banner"
        {...parallaxProps} />
    )
  }

  const renderProfessionalItem = ({ item, index }, parallaxProps) => {
    return (
      <Card.Home
        item={item}
        onPress={() => alert('helloo')}
        type="Professional"
        {...parallaxProps}
      />
    )
  }

  const renderRoomCategory = ({ item, index}, parallaxProps) => {
    return (
      <Card.Home
        item={item}
        onPress={() => navigation.navigate("Catalogue", {
          screen: 'Design',
          params: { rid: item.id}
        })}
        type="Design"
        {...parallaxProps}
      />
    )
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Container.GreenBackGround>
          <View style={styles.headerContainer}>
            <View>
              <HText.Primary style={styles.welcomeText}>Selamat Datang,</HText.Primary>
              <Text style={styles.username}>{user.name}</Text>
            </View>
            <TouchableOpacity onPress={()=> alert('Hello')}>
              <MaterialIcons name="heart-outline" size={18} color={'#ffffff'} style={styles.icon}/>
            </TouchableOpacity>
          </View>
        </Container.GreenBackGround>
        <View style={styles.carouselContainer}>
          <Carousel.Primary
            data={carousel.carouselItems}
            index={carousel.activeIndex}
            renderItem={renderBannerItem}
            onBeforeSnapToItem={index => setCarousel(prev => ({ ...prev, activeIndex: index }))}
            paginate
            parallax
          />
        </View>
        <Container.Primary style={{ marginBottom: height * 0.029 }}>
          <HText.Primary style={{ color: color.black, fontSize: 20 }}>
            Kategori Professional
          </HText.Primary>
        </Container.Primary>
        <View style={{ flexDirection: 'row' }}>
          <Carousel.Primary
            data={professionalTypes}
            renderItem={renderProfessionalItem}
            sliderWidth={width * 0.83}
            itemWidth={width * 0.83 - 60}
            parallax
          />
        </View>
        <Container.Primary style={{
          marginBottom: height * 0.029,
          marginTop: height * 0.05
        }}>
          <HText.Primary style={{ color: color.black, fontSize: 20 }}>
            Kategori Ruangan
          </HText.Primary>
        </Container.Primary>
        <View style={{ flexDirection: 'row', marginBottom: 50 }}>
          <Carousel.Primary
            data={roomCategory}
            renderItem={renderRoomCategory}
            sliderWidth={width * 0.83}
            itemWidth={width * 0.83 - 60}
            parallax
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default Home

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    paddingHorizontal: 30,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  welcomeText: {
    fontFamily: font.primary,
    fontWeight: 'bold',
    color: color.white,
    fontSize: 16,
    marginBottom: height * 0.012
  },
  username: {
    fontFamily: font.primary,
    color: color.white,
    fontWeight: 'bold',
    fontSize: 20
  },
  carouselContainer: {
    marginTop: -(width * 0.37),
  },
  icon: {
    alignSelf: 'center',
    fontSize: 20,
    marginRight: 5
  }
})
