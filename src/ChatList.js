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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

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
      <View style={{ flex: 1 }}>
        <ScrollView>
          {renderChatList(chatList)}

          <View style={{ margin: 50, flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity
              style={styles.centerContent}
              onPress={() => {}}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#E8E8E8' }]}>
                <MaterialCommunityIcons
                  name='share-variant'
                  size={30}
                  color='black'
                />
              </View>
              <Text style={{ textAlign: 'center', fontSize: 13, lineHeight: 30 }}>Share APP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.centerContent}
              onPress={() => {}}
            >
              <View style={[styles.iconContainer, { backgroundColor: '#E8E8E8' }]}>
                <MaterialCommunityIcons
                  name='content-copy'
                  size={30}
                  color='black'
                />
              </View>
              <Text style={{ textAlign: 'center', fontSize: 13, lineHeight: 30 }}>Copy UID</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={{ bottom: 5, alignContent: 'center', alignItems: 'center' }}>
          <Text>{`Logged In as: ${user.email ? user.email : 'Anon User'}`}</Text>
        </View>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => NavigationService.navigate('UserList')}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name='message-plus'
              size={30}
              color='white'
            />
          </View>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 11, lineHeight: 20 }}>ADD CHAT</Text>
        </TouchableOpacity>
      </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    position: "absolute",
    right: 8,
    bottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    elevation: 5,
    backgroundColor: '#3366ff',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

})

export default ChatList
