import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native'
import { NavigationContext } from 'react-navigation'
import firebase from 'react-native-firebase'
import { GiftedChat } from 'react-native-gifted-chat'

const ChatThread = () => {
  const navigation = useContext(NavigationContext);
  const conversationId = navigation.getParam('conversationId', null)
  const [gMessages, setGMessages] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      firebase.auth().onAuthStateChanged((user) => {
        setUser(user)
      })
    }

    if (conversationId && gMessages.length === 0) {
      fetchMessages(conversationId)
    }
  })

  fetchMessages = (conversationId) => {
    firebase.database().ref(`messages/${conversationId}`).orderByChild('createdAt').on('value', (snapshot) => {
      if (snapshot.val()) {
        let giftedChatMessages = Object.values(snapshot.val())
        setGMessages(giftedChatMessages)
      }
    })
  }

  createChat = (messages) => {
    // create conversation
    firebase.database().ref('conversations/').push({
      lastUpdatedAt: new Date().getTime(),
      lastMessage: messages[0].text,
    })
      .then(conversation => {
        console.log('create conver HAPA', conversation)
        // add conversation members
        firebase.database().ref(`conversations/${conversation.key}/members`).push({ id: user.uid })

        // create membership to conversation
        firebase.database().ref('membership/'+ user.uid).push({
          conversationId: conversation.key,
          lastMessageAt: new Date().getTime(),
        })

        // save message
        firebase.database().ref('messages/' + conversation.key).push({
          text: messages[0].text,
          createdAt: new Date(messages[0].createdAt).getTime(),
          user: { _id: user.uid }
        })

        fetchMessages(conversation.key)
      })
  }

  sendMessage = (messages = []) => {
    firebase.database().ref('messages/' + conversationId).push({
      text: messages[0].text,
      createdAt: new Date(messages[0].createdAt).getTime(),
      user: { _id: user.uid }
    })

    firebase.database().ref('conversations/' + conversationId).update({
      lastUpdatedAt: new Date().getTime(),
      lastMessage: messages[0].text,
    })
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <GiftedChat
      messages={gMessages}
      onSend={
        messages => gMessages.length === 0 ?
          createChat(messages) : sendMessage(messages)
      }
      user={{
        _id: user.uid,
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
  },
})

export default ChatThread
