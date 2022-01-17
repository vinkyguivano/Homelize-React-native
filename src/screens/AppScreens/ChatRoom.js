import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { Image, StyleSheet, Text, View, BackHandler, TouchableNativeFeedback, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import AuthContext from '../../context/AuthContext'
import firebase from '../../config/firebase'
import { api, font } from '../../utils'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ChatRoom = ({ navigation, route: { params } }) => {
  const [messages, setMessages] = useState([])
  const { name, id, to, image_path } = params
  const { user: { user: { id: id2 } } } = useContext(AuthContext)
  const { user: { token } } = useContext(AuthContext)
  
  let clientId, professionalId, senderId
  if (to === 'professional') {
    professionalId = id
    clientId = id2
    senderId = `c_${clientId}`
  } else {
    clientId = id
    professionalId = id2
    senderId = `p_${professionalId}`
  }

  const ref = `Chatroom_c_${clientId}_p_${professionalId}`

  const backAction = () => {
    navigation.goBack()
    params.onGoBack?.()
    return true
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft:  () => (
        <TouchableNativeFeedback onPress={backAction}>
          <View style={{marginRight: 24}}>
            <Icon name="arrow-left" color={'black'} size={24}/>
          </View>
        </TouchableNativeFeedback>
      ),
      headerTitle: (props) => (
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Photo', {
            from: 'Chat Room',
            data: { uri : image_path }
          })}>
            <Image
              source={{ uri: image_path }}
              style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.text} numberOfLines={1}>{name}</Text>
        </View>
      ),
      headerBackVisible: false
    })

    BackHandler.addEventListener("hardwareBackPress", backAction)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction)
    }
  }, [])

  useEffect(() => {
    firebase._ref = ref
    const onChildAdd = firebase.refOn((message) => {
      setMessages(prev => GiftedChat.append(prev, message))
    })

    return () => {
      firebase._ref.off('child_added', onChildAdd)
    }
  }, [])

  const updateMessage = async (messages) => {
    const { text } = messages.slice(-1)[0]
    const res = await api.post(`chats/${ref}`, token, {
      user_id : clientId,
      professional_id: professionalId,
      last_message: text
    })
  }

  const onSend = (messages) => {
    firebase.send(messages)
    updateMessage(messages)
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: senderId
      }}
      renderAvatar={null} />
  )
}

export default ChatRoom

const styles = StyleSheet.create({
  image: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: .5,
    borderColor: 'darkgrey',
    marginRight: 15
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 20
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontFamily: font.secondary,
    flex: 1
  }
})
