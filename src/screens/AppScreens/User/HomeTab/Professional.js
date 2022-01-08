import React, { useState, useEffect, useCallback, useRef } from 'react'
import { FlatList, StyleSheet, Text, View, PermissionsAndroid } from 'react-native'
import GeoLocation from 'react-native-geolocation-service'
import {
  storage,
  api,
  professionalSorting as sorts,
  professionalType as types
} from '../../../../utils'
import { showMessage } from 'react-native-flash-message'
import { useScrollToTop } from '@react-navigation/native'
import * as Header from '../../../../components/Header'
import * as Card from '../../../../components/Card'
import * as Skeleton from '../../../../components/Skeleton'
import * as NotFound from '../../../../components/NotFound'
import * as Modal from '../../../../components/Modal'
import PrimaryIndicator from '../../../../components/ActivityIndicator'

const Professional = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    sorts: sorts,
    types: types,
    cities: []
  });
  const [q, setQ] = useState('');
  const [professionalList, setProfessionalList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    sort: '',
    city: '',
    type: route.params?.tid || ''
  })
  const [tempFilter, setTempFilter] = useState({
    sort: '',
    city: '',
    type: '',
  })
  const [position, setPosition] = useState({
    latitude: '',
    longitude: ''
  })
  const flatListRef = useRef(null)

  useEffect(() => {
    if (isModalVisible) {
      setTempFilter({
        sort: selectedFilter.sort,
        city: selectedFilter.city,
        type: selectedFilter.type
      })
    }
  }, [isModalVisible])

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await getPosition();
        if (res.latitude & res.longitude) {
          setPosition({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
        const { token } = await storage.getData("client_data")
        setToken(token)
      } catch (e) {
        setError("Failed to fetch token")
      }
    }

    fetchToken();
  }, [])

  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger'
      })
      setError('')
    }
  }, [error])

  useEffect(() => {
    async function fetchData() {
      if (token) {
        if (filter.cities.length === 0) {
          fetchCities()
        }
        fetchProfessionalList(true)
      }
    }

    fetchData()
  }, [token, selectedFilter.city, selectedFilter.sort, selectedFilter.type])

  const fetchCities = useCallback(async () => {
    try {
      const { data } = await api.get('professional/cities', token)
      setFilter(prev => ({
        ...prev,
        cities: data
      }))
    } catch (e) {
      setError(e.toString())
    }
  }, [token])

  const fetchProfessionalList = async (refresh = false) => {
    const { type, sort, city } = selectedFilter
    try {
      if (refresh) {
        setLoading(true)
        setRefresh(true)
      }

      let _page

      if (refresh) {
        _page = 1
      } else {
        _page = page + 1
      }

      const queryParams = {
        page: _page,
        ...type ? { tid: type } : {},
        ...sort ? { sort: sort } : {},
        ...city ? { cid: city } : {},
        ...position.latitude ? { lat: position.latitude } : {},
        ...position.longitude ? { lng: position.longitude } : {},
        ...q ? { q: q } : {}
      }

      const { data } = await api.get('professional/professionals', token, queryParams)
      const { data: list, last_page } = data

      if (refresh) {
        currentList = [...list]
      } else {
        currentList = [...professionalList, ...list]
      }

      setProfessionalList(currentList)
      setPage(_page)
      setHasMore(_page < last_page)
      if (refresh) {
        setLoading(false)
        setRefresh(false)
      }

    } catch (e) {
      setRefresh(false)
      setLoading(false)
      setError(e)
    }
  }

  const getPosition = async () => {
    let res;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      res = await new Promise((resolve, reject) => {
        GeoLocation.getCurrentPosition(
          (position) => {
            const longitude = JSON.stringify(position.coords.longitude),
              latitude = JSON.stringify(position.coords.latitude)
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

  const selectFilterItems = (id, type) => {
    let value = tempFilter[type] === id ? '' : id

    setTempFilter((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const resetFilter = () => {
    setTempFilter({
      sort: '',
      city: '',
      type: ''
    })
  }

  const onSubmit = async () => {
    setIsModalVisible(false)

    if(tempFilter.sort === 0 && !position.latitude && !position.longitude){
      const res = await getPosition();
      if (res.latitude && res.longitude) {
        setPosition({
          latitude: res.latitude,
          longitude: res.longitude
        })
      } else if(res === "Permission Denied") {
        setError("Silahkan nyalakan izin lokasi anda")
        return;
      }
    }

    flatListRef.current.scrollToOffset({
      offset: 0,
      animated: false
    })

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(setSelectedFilter(tempFilter))
      }, 200)
    })
  }

  const onToggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  const renderItem = ({ item, index }) => (
    <Card.Professional item={item} index={index} navigation={navigation} />
  )

  const renderLoading = (
    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
      {(hasMore && !loading) && <PrimaryIndicator />}
    </View>
  )

  const emptyComponent = (
    <>
      {
        loading ?
          Array.from(Array(6), (_, i) => (
            <Skeleton.Professional key={i} />
          ))
          : <NotFound.Design />
      }
    </>
  )

  useScrollToTop(flatListRef)
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        stickyHeaderHiddenOnScroll={true}
        stickyHeaderIndices={[0]}
        ref={flatListRef}
        data={professionalList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.8}
        onEndReached={() => { fetchProfessionalList(false) }}
        initialNumToRender={6}
        onRefresh={() => fetchProfessionalList(true)}
        refreshing={refresh}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={renderLoading}
        extraData={hasMore, loading}
        ListHeaderComponent={
          <Header.Primary
            placeholder={"Cari professional disini..."}
            value={q}
            onChangeText={(text) => setQ(text)}
            onSubmit={() => { fetchProfessionalList(true) }}
            onOpenFilter={onToggleModal}
            filterCount={Object.keys(selectedFilter).filter(i => selectedFilter[i] !== '').length}
          />
        }
      />
      <Modal.Professional
        isVisible={isModalVisible}
        toggleModal={onToggleModal}
        filter={filter}
        onSubmit={onSubmit}
        resetFilter={resetFilter}
        selectFilterItem={selectFilterItems}
        selectedFilter={selectedFilter}
        tempFilter={tempFilter}
      />
    </View>
  )
}

export default Professional

const styles = StyleSheet.create({})
