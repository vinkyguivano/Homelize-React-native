import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, TouchableNativeFeedback, View, PermissionsAndroid } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import GeoLocation from 'react-native-geolocation-service'
import Loading from '../../../components/Loading'
import * as Button from '../../../components/Button'

const Map = ({ route : { params }, navigation}) => {
  const { selectedLocation, fromCompleteProfile } = params
  const [loading, setLoading] = useState(false)
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })
  const [isMapReady, setIsMapReady] = useState(false)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      if (!selectedLocation) {
        const res = await getPosition()
        if (res.latitude && res.longitude) {
          setRegion(prev => ({
            ...prev,
            latitude: res.latitude,
            longitude: res.longitude
          }))
        }
      } else {
        setRegion(prev => ({
          ...prev,
          ...selectedLocation
        }))
      }
      setLoading(false)
    }

    fetch()
  }, [])

  const getPosition = async () => {
    let res;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      res = await new Promise((resolve, reject) => {
        GeoLocation.getCurrentPosition(
          (position) => {
            const longitude = parseFloat(position.coords.longitude),
              latitude = parseFloat(position.coords.latitude)
            resolve({ latitude, longitude })
          }
        ),
          (error) => {
            setError(`${error.code} ${error.message}`)
            resolve({})
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      })
    } else {
      res = "Permission Denied"
    }

    return res
  }

  const onBackPress = () => {
    navigation.goBack()
  }

  const onSubmit = () => {
    navigation.navigate({
      name: fromCompleteProfile ? 'Profile Completion' : '',
      params: { location: region},
      merge: true
    })
  }

  return (
    <View style={styles.container}>
      {loading ? <Loading />
        :
        <>
          <TouchableNativeFeedback onPress={onBackPress} >
            <View style={[styles.backButtonContainer, { display : isMapReady ? 'flex' : 'none'}]}>
              <Icon name='arrow-left' color={'black'} size={25} />
            </View>
          </TouchableNativeFeedback>
          <MapView
            onMapReady={() => setIsMapReady(true)}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            onRegionChange={setRegion}
            style={styles.map}>
            <Marker coordinate={region} />
          </MapView>
          <View style={[styles.buttonContainer, { display : isMapReady ? 'flex' : 'none'}]}>
            <Button.PrimaryButton
              title={"Tetapkan titik alamat"} 
              paddingHorizontal={30}
              height={50}
              onPress={onSubmit}/>
          </View>
        </>
      }
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  backButtonContainer: {
    zIndex: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 12,
    padding: 12,
    width: 70,
    alignItems: 'center',
    alignSelf: 'flex-start',
    top: 20,
    left: 20
  },
  buttonContainer: {
    bottom: 70,
    position: 'absolute',
  }
})
