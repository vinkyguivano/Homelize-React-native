import React, { useEffect, useState, useContext, useRef} from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import * as Container from '../../../components/Container'
import { Main as Text } from '../../../components/Text'
import AuthContext from '../../../context/AuthContext'
import { api } from '../../../utils'
import * as NotFound from '../../../components/NotFound'
import PrimaryIndicator from '../../../components/ActivityIndicator'
import * as Card from '../../../components/Card'
import Loading from '../../../components/Loading'

const Order = ({ navigation }) => {
  const { user : { user, token } } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const flatListRef = useRef(null)

  useEffect(() => {
    fetchOrderList(true)
  }, [])

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
        pid: user.id
      }

      const { data } = await api.get('orders', token, queryParams)
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
      showMessage({
        message: 'Error ' + e,
        type: 'danger'
      })
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefresh(true)
    await fetchOrderList(true)
    setRefresh(false)
  }

  const emptyComponent = (
    <View>
      { !loading && <NotFound.Design 
        label={'Anda belum memiliki order yang masuk'} 
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

  const onRenderItem = ({item, index}) => {
    return (
      <Card.OrderProfessional 
        key={index} 
        item={item}
        onSelectItem={selectItem} />
    )
  }

  const selectItem = (item) => {
    navigation.navigate('Order Detail', {
      orderId: item.id
    })
  }

  console.log(user)

  return (
    <Container.Main>
      {
        loading ? <Loading /> : 
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
    </Container.Main>
  )
}

export default Order

const styles = StyleSheet.create({})
