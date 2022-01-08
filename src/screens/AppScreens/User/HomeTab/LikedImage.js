import React, { useState, useEffect, useContext } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import PrimaryIndicator from '../../../../components/ActivityIndicator'
import * as Card from '../../../../components/Card'
import * as NotFound from '../../../../components/NotFound'
import AuthContext from '../../../../context/AuthContext'
import { showMessage } from 'react-native-flash-message'
import { api } from '../../../../utils'
import Loading from '../../../../components/Loading'

const LikedImage = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [error, setError] = useState('')
  const [imageList, setImageList] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger'
      })
    }
  }, [error])

  useEffect(() => {
    async function fetch(){
      setLoading(true)
      await fetchList(true)
      setLoading(false)
    }

    fetch()
  }, [])

  const fetchList = async (refresh = false) => {
    try {

      let _page = refresh ? 1 : page + 1

      const { data } = await api.get('design/user/images', user.token, {
        page: _page
      })
      const { data: list, last_page } = data

      if (refresh) {
        currentList = [...list]
      } else {
        currentList = [...imageList, ...list]
      }

      setImageList(currentList)
      setPage(_page)
      setHasMore(_page < last_page)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const onRefresh = async() => {
    setRefresh(true)
    await fetchList(true)
    setRefresh(false)
  }

  const renderItem = ({ item, index }) => {
    return (
      <Card.Design 
        item={item} 
        index={index} 
        navigation={navigation} 
        type="Liked Image"
        onUnlikedImage={onUnlikedImage} />
    )
  }

  const renderLoading = (
    <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 20 }}>
      {(hasMore && !loading) && <PrimaryIndicator />}
    </View>
  )

  const onUnlikedImage = async(imageId, index) => {
    Alert.alert(
      "Pesan",
      "Apakah anda ingin menghapus foto ini dari daftar suka ?",
      [
        {
          text: 'Ya',
          onPress: async () => {
            try {
              await api.delete(`design/user/images/${imageId}`, user.token)
              const list = [...imageList]
              list.splice(index, 1)
              setImageList(list)
            } catch (error) {
              setError(`${error}`)
            }
          }
        },
        {
          text: "Tidak"
        }
      ],
      {
        cancelable: true
      }
    )

  }

  if(loading){
    return <Loading />
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        contentContainerStyle = {{
          padding: 20,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between'
        }}
        numColumns={2}
        data={imageList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.8}
        onEndReached={() => { fetchList(false) }}
        initialNumToRender={6}
        onRefresh={onRefresh}
        refreshing={refresh}
        ListEmptyComponent={
          <NotFound.Design
            styleImage={{marginBottom: 20}}
            label={`Anda belum menambahkan gambar yang disukai`}/>
        }
        ListFooterComponent={renderLoading}
        extraData={hasMore, loading}
        />
    </View>
  )
}

export default LikedImage

const styles = StyleSheet.create({})
