import React, { useEffect, useContext, useState, useRef } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import * as Container from '../../../components/Container'
import * as Text from '../../../components/Text'
import AuthContext from '../../../context/AuthContext'
import PrimaryIndicator from '../../../components/ActivityIndicator'
import Loading from '../../../components/Loading'
import * as Header from '../../../components/Header'
import { showMessage } from 'react-native-flash-message'
import { api } from '../../../utils'
import * as Card from '../../../components/Card'
import * as NotFound from '../../../components/NotFound'
import * as Modal from '../../../components/Modal'
import { orderStatus } from '../../../utils'

const Order = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const filterOption = [
    {id : 0, label: 'Semua'},
    ...orderStatus
  ]
  const flatListRef = useRef(null)

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
    fetchOrderList(true)
  }, [status])

  const fetchOrderList = async (refresh = false) => {
    try {
      if (refresh) {
        setLoading(true)
      }
      let newPage;

      if (refresh) {
        newPage = 1
      } else {
        newPage = page + 1
      }

      const queryParams = {
        page: newPage,
        ...status ? { sid: status } : {}
      }

      const { data } = await api.get('orders', user.token, queryParams)
      const { data: list, last_page } = data

      let currList
      if (refresh) {
        currList = [...list]
      } else {
        currList = [...orderList, ...list]
      }

      setOrderList(currList)
      setPage(newPage)
      setHasMore(newPage < last_page)

      if (refresh) {
        setLoading(false)
      }
    } catch (e) {
      setError(`${e}`)
      setLoading(false)
    }
  }

  const onRenderItem = ({item, index}) => {
    return (
      <Card.Order 
        key={index} 
        item={item}
        onSelectItem={onSelectItem} />
    )
  }

  const onSelectItem = item => {
    if(item.status_id === 1){
      navigation.navigate('Order Payment', { oid: item.id})
    }else{
      navigation.navigate('Order Detail', {oid: item.id})
    }
  }

  const onToggleModal = () => setIsModalVisible(!isModalVisible)

  const onRefresh = async () => {
    setRefresh(true)
    await fetchOrderList(true)
    setRefresh(false)
  }

  const onChangeModal = (value) => {
    setIsModalVisible(false)
    setStatus(value)
  }

  const emptyComponent = (
    <View>
      { !loading && <NotFound.Design 
        label={'Anda belum memiliki order'} 
        fontStyle={{
          marginTop: 20,
          fontSize: 16,
        }}
        styleContainer={{
          marginTop: 90
        }}/>}
    </View>
  )

  const renderLoading= (
    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
      {(hasMore && !loading) && <PrimaryIndicator />}
    </View>
  )

  return (
    <Container.Main>
      <Header.Order openFilter={() => setIsModalVisible(true)}/>
      {loading ? <Loading /> :
        <View style={{flex: 1}}>
          <FlatList
            ref={flatListRef}
            data={orderList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={onRenderItem}
            onEndReachedThreshold={0.5}
            onEndReached={() => fetchOrderList(false)}
            initialNumToRender={6}
            onRefresh={onRefresh}
            refreshing={refresh} 
            ListEmptyComponent={emptyComponent}
            ListFooterComponent={renderLoading}
          />
        </View>
      }
      <Modal.Secondary 
        isVisible={isModalVisible}
        toggleModal={onToggleModal}
        label={'Filter'}
        optionList={filterOption}
        selectedOption={status}
        onChange={onChangeModal}/>
    </Container.Main>
  )
}

export default Order

const styles = StyleSheet.create({})