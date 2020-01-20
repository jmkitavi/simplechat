import React, { useEffect, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import firebase from 'react-native-firebase'
import { NavigationActions } from 'react-navigation'
import ChatItem from './ChatItem'

const Home = () => {
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
    firebase.database().ref(`membership/` + uid).orderByChild('lastMessageAt').on('value', (snapshot) => {
      let chatList =  Object.values(snapshot.val()).reverse()
      setChatList(chatList)
    })
  }

  renderChatList = (chatList) => {
    if(!chatList) return fetchChatList(user.uid)

    return chatList.map((chat) =>
      <ChatItem conversationId={chat.conversationId} />
    )
  }

  return (
    <View style={styles.container}>
      {!user ? (
        <ActivityIndicator />
      ) : (
      <View>
        <Text>{`Email: ${user.email}`}</Text>
        <Text>{`Unique Identifier: ${user.uid}`}</Text>

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
})

export default Home
