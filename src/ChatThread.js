import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native'
import { NavigationContext } from 'react-navigation'
import firebase from 'react-native-firebase'
import { GiftedChat } from 'react-native-gifted-chat'
import NavigationService from './NavigationService'

const ChatThread = () => {
  const navigation = useContext(NavigationContext);
  const [conversationId, setConversationId] = useState(navigation.getParam('conversationId', null))
  const [recepientId, setRecepientId] = useState(navigation.getParam('recepientId', null))
  const [gMessages, setGMessages] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!user) {
      firebase.auth().onAuthStateChanged((user) => {
        setUser(user)

        // load messages if any, from user list
        if (recepientId) {
          firebase.database().ref(`membership/${user.uid}`).orderByChild('receiverId').equalTo(recepientId).on('value', (snapshot) => {
            if (snapshot.val()) {
              const membership = Object.values(snapshot.val())[0]
              setConversationId(membership.conversationId)
              return fetchMessages(membership.conversationId)
            }
          })
        }

        // load messages from chat list
        if (conversationId && gMessages.length === 0) {
          // get recepientId
          firebase.database().ref('conversations/' + conversationId).on('value', (snapshot) => {
            const members = Object.values(snapshot.val().members)
            members.map(member => {
              if (member.id !== user.uid)  setRecepientId(member.id)
            })
          })
          return fetchMessages(conversationId)
        }

      })
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
    // creating chat without recepientId return UserList TODO: show Error
    if (!recepientId) return NavigationService.navigate("UserList")

    // create conversation
    firebase.database().ref('conversations/').push({
      lastUpdatedAt: new Date().getTime(),
      lastMessage: messages[0],
    })
      .then(conversation => {
        // add conversation members
        firebase.database().ref(`conversations/${conversation.key}/members`).push({ id: user.uid })
        firebase.database().ref(`conversations/${conversation.key}/members`).push({ id: recepientId })

        // create membership to conversation
        firebase.database().ref(`membership/${user.uid}/${conversation.key}`).set({
          conversationId: conversation.key,
          lastMessageAt: new Date().getTime(),
          receiverId: recepientId
        })

        firebase.database().ref(`membership/${recepientId}/${conversation.key}`).set({
          conversationId: conversation.key,
          lastMessageAt: new Date().getTime(),
          receiverId: user.uid
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

    // update memberships to conversation
    firebase.database().ref(`membership/${user.uid}/${conversationId}`).update({
      lastMessageAt: new Date().getTime(),
    })

    firebase.database().ref(`membership/${recepientId}/${conversationId}`).update({
      lastMessageAt: new Date().getTime(),
    })

    firebase.database().ref('conversations/' + conversationId).update({
      lastUpdatedAt: new Date().getTime(),
      lastMessage: {
        text: messages[0].text,
        createdAt: new Date(messages[0].createdAt).getTime(),
        user: { _id: user.uid }
      }
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
