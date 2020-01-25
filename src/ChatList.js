import React, { useEffect, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import firebase from 'react-native-firebase'
import { NavigationActions } from 'react-navigation'
import ChatItem from './ChatItem'
import NavigationService from './NavigationService'

const ChatList = () => {
  const [user, setUser] = useState(null)
  const [chatList, setChatList] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return NavigationActions.navigate("Login")
      }

      setUser(user)

      if (!chatList) {
        fetchChatList(user.uid)
      }
    })
  })

  fetchChatList = (uid) => {
    firebase.database().ref(`membership/${uid}`).orderByChild('lastMessageAt').on('value', (snapshot) => {
      if (snapshot.val()) {
        let chatList =  Object.values(snapshot.val()).sort((a, b) => a.lastMessageAt < b.lastMessageAt)
        setChatList(chatList)
      }
    })
  }

  renderChatList = (chatList) => {
    if(!chatList) return fetchChatList(user.uid)

    return chatList.map((chat) =>
      <ChatItem conversationId={chat.conversationId} key={chat.conversationId} />
    )
  }

  return (
    <View style={styles.container}>
      {!user ? (
        <ActivityIndicator />
      ) : (
      <View>
        <Text>{`Email: ${user.email ? user.email : 'Anon User'}`}</Text>
        <Text>{`Unique Identifier: ${user.uid}`}</Text>
        <TouchableOpacity
          onPress={() => NavigationService.navigate('UserList')}
          style={styles.createButton}
        >
          <Text>CREATE CHAT</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 10 }}>
          {renderChatList(chatList)}
        </View>
      </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  createButton:{
    alignSelf: 'flex-end',
    margin: 10,
    padding: 5,
    backgroundColor: 'grey',
    width: '30%',
  },
})

export default ChatList
