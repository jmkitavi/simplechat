import React, { useEffect, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
      <ChatItem
        chat={chat}
        key={chat.conversationId}
      />
    )
  }

  return (
    <View style={styles.container}>
      {!user ? (
        <ActivityIndicator />
      ) : (
      <View>
        <ScrollView>
          {renderChatList(chatList)}
        </ScrollView>

        <View style={{ bottom: 5, alignContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => NavigationService.navigate('UserList')}
            style={styles.createButton}
          >
            <Text>CREATE CHAT</Text>
          </TouchableOpacity>
          <Text>{`Logged In as: ${user.email ? user.email : 'Anon User'}`}</Text>
          <Text>{`Unique Identifier: ${user.uid}`}</Text>
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
  },
  createButton:{
    alignSelf: 'flex-end',
    marginVertical: 10,
    padding: 5,
    backgroundColor: 'grey',
    width: '30%',
  },
})

export default ChatList
