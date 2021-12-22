import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, FlatList, Dimensions, Text, Button, Image, TextInput } from 'react-native'
import { storage, api, color } from '../../../utils'
import PrimaryIndicator from '../../../components/ActivityIndicator'
import * as Card from '../../../components/Card'
import * as Header from '../../../components/Header'
import * as Skeleton from '../../../components/Skeleton'
import * as NotFound from '../../../components/NotFound'
import * as Modal from '../../../components/Modal'
import { showMessage } from 'react-native-flash-message'
import { useScrollToTop } from '@react-navigation/native'

const Design = ({ route, navigation }) => {
  const [token, setToken] = useState("");
  const [filter, setFilter] = useState({
    budgets: [],
    designs: [],
    rooms: []
  })
  const [designList, setDesignList] = useState([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const { designs, rooms, budgets } = filter
  const [refresh, setRefresh] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedFilter, setSelectedFilter] = useState({
    room: route.params?.rid || '',
    style: '',
    budget: ''
  })
  const [tempFilter, setTempFilter] = useState({
    room: '',
    style: '',
    budget: '',
  })

  let flatListRef = React.useRef(null);

  useEffect(() => {
    if (isModalVisible) {
      setTempFilter({
        room: selectedFilter.room,
        style: selectedFilter.style,
        budget: selectedFilter.budget
      })
    }
  }, [isModalVisible])

  useEffect(() => {
    async function fetchToken() {
      try {
        const { token } = await storage.getData("client_data")
        setToken(token)
      } catch (e) {
        setErrorMsg("Failed to fetch token")
      }
    }

    fetchToken();
  }, [])

  useEffect(() => {
    async function fecthData() {
      if (token) {
        if (designs.length === 0 || rooms.length === 0 || budgets.length === 0) {
          fetchFilter();
        }
        fetchDesignList(true);
      }
    }

    fecthData()
  }, [token, selectedFilter.room, selectedFilter.budget, selectedFilter.style])

  useEffect(() => {
    if (errorMsg) {
      showMessage({
        message: errorMsg,
        type: 'danger'
      })
    }
  }, [errorMsg])

  const selectFilterItems = (value, type) => {
    let id = tempFilter[type] === value ? '' : value

    setTempFilter((prev) => ({
      ...prev,
      [type]: id,
    }))
  }

  const resetFilter = () => {
    setTempFilter({
      room: '',
      style: '',
      budget: '',
    })
  }

  const onSubmit = async () => {
    setIsModalVisible(false)
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

  const fetchFilter = async () => {
    try {
      const { data } = await api.get('design/filters', token)
      setFilter(data)
    } catch (e) {
      setErrorMsg(e.toString())
    }
  }

  const fetchDesignList = async (refresh = false) => {
    try {
      const { budget, room, style } = selectedFilter

      if (refresh) {
        setRefresh(true)
        setLoading(true)
      }

      let _page

      if (refresh) {
        _page = 1
      } else {
        _page = page + 1
      }

      const queryParams = {
        page: _page,
        ...budget ? { bid: budget } : {},
        ...room ? { rid: room } : {},
        ...style ? { sid: style } : {},
        ...q ? { q: q } : {}
      }

      const { data } = await api.get('design/images', token, queryParams)
      const { data: list, last_page } = data

      if (refresh) {
        currentList = [...list]
      } else {
        currentList = [...designList, ...list]
      }

      setDesignList(currentList)
      setPage(_page)
      setHasMore(_page < last_page)
      if(refresh){
        setRefresh(false)
        setLoading(false)
      }
     
    } catch (e) {
      setRefresh(false)
      setErrorMsg(e.toString())
    }
  }

  const onRenderItem = ({ item, index }) => {
    return (
      <Card.Design 
      item={item} 
      index={index}
      navigation={navigation} />
    )
}

  const renderLoading = (
    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
      {(hasMore && !loading) && <PrimaryIndicator />}
    </View>
  )

  const emptyComponent = (
    <>
      {
        loading ?
          Array.from(Array(3), (_, i) => (
            <View key={i} style={[styles.columnWrapper, { flexDirection: 'row' }]}>
              {
                Array.from(Array(2), (_, i) => (
                  <Skeleton.Design key={i} />
                ))
              }
            </View>
          ))
          : <NotFound.Design />
      }
    </>
  )

  const onToggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  useScrollToTop(flatListRef)
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        ref={flatListRef}
        stickyHeaderHiddenOnScroll={true}
        stickyHeaderIndices={[0]}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        data={designList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={onRenderItem}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.8}
        onEndReached={() => { fetchDesignList(false) }}
        initialNumToRender={6}
        onRefresh={() => fetchDesignList(true)}
        refreshing={refresh}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={renderLoading}
        extraData={hasMore, loading}
        ListHeaderComponent={
          <Header.Primary
            placeholder={"Cari desain disini..."}
            value={q}
            onChangeText={(text) => setQ(text)}
            onSubmit={() => { fetchDesignList(true) }}
            onOpenFilter={onToggleModal}
            filterCount={Object.keys(selectedFilter).filter(i => selectedFilter[i] !== '').length}
          />}
      />
      <Modal.Design
        isVisible={isModalVisible}
        toggleModal={onToggleModal}
        designs={designs}
        rooms={rooms}
        budgets={budgets}
        tempFilter={tempFilter}
        selectedFilter={selectedFilter}
        selectFilterItem={selectFilterItems}
        resetFilter={resetFilter}
        onSubmit={onSubmit} />
    </View>
  )
}

export default Design

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 20,
  }
})
