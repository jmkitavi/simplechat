import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import firebase from 'react-native-firebase'
import NavigationService from './NavigationService'

const image = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'

const ChatItem = ({ chat }) => {
  const [conversation, setConversation] = useState(null)
  const [receiver, setReceiver] = useState(null)

  useEffect(() => {
    if (!conversation) {
      firebase.database().ref('conversations/' + chat.conversationId).on('value', (snapshot) => {
        setConversation(snapshot.val())
      })
      firebase.database().ref(`users/${chat.receiverId}`).on('value', (snapshot) => {
        setReceiver(snapshot.val())
      })
    }
  })

  if (!conversation || !receiver) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => NavigationService.navigate('ChatThread', { conversationId: chat.conversationId })}
    >
      <Image
        source={{ uri: image }}
        style={styles.profile}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{receiver.isAnonymous ? 'Anon User' : receiver.email}</Text>
        <Text>{conversation.lastMessage.text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: 'center',
    borderBottomWidth: .5,
    borderBottomColor: 'grey',
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
  }
})

export default ChatItem
