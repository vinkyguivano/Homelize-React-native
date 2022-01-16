import React, { useEffect, useContext, useState, useRef } from 'react'
import { StyleSheet, FlatList, View } from 'react-native'
import * as Container from '../../components/Container'
import { Main as Text} from '../../components/Text'
import AuthContext from '../../context/AuthContext'
import PrimaryIndicator from '../../components/ActivityIndicator'
import Loading from '../../components/Loading'
import * as Header from '../../components/Header'
import { showMessage } from 'react-native-flash-message'
import { api } from '../../utils'
import * as Card from '../../components/Card'
import * as NotFound from '../../components/NotFound'

const ChatList = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [userList, setUserList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState('')
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
    fetchUserList(true)
  }, [])

  const fetchUserList = async (refresh = false) => {
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
        type: user.type === 'user' ? 1 : 2
      }

      const { data } = await api.get(`chats/${user.user.id}`, user.token, queryParams)
      const { data: list, last_page } = data

      let currList
      if (refresh) {
        currList = [...list]
      } else {
        currList = [...userList, ...list]
      }

      setUserList(currList)
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

  const onRefresh = async () => {
    setRefresh(true)
    await fetchUserList(true)
    setRefresh(false)
  }

  const onRenderItem = ({item, index}) => {
    return (
     <Card.Contact 
      key={index}
      item={item}
      onSelectItem={onSelectItem}/>
    )
  }

  const onSelectItem = (item) => {
    navigation.navigate("Chat Room", {
      id : item.id,
      name : item.name,
      to : user.type === 'user' ? 'professional' : 'user',
      image_path : item.image_path,
      onGoBack: () => fetchUserList(true)
    })
  }

  const emptyComponent = (
    <View>
      { !loading && <NotFound.Design 
        label={'Anda belum mmemiliki chat'} 
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
      { user.type === "user" && <Header.Main label={"Chat"}/>}
      {loading ? <Loading /> :
        <View style={{flex: 1}}>
          <FlatList
            ref={flatListRef}
            data={userList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={onRenderItem}
            onEndReachedThreshold={0.5}
            onEndReached={() => fetchUserList(false)}
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

export default ChatList

const styles = StyleSheet.create({})
