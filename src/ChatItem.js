import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import firebase from 'react-native-firebase'
import NavigationService from './NavigationService'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

const placeHolderImage = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'

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
        <ShimmerPlaceHolder autoRun={true} style={styles.profile}/>
        <View style={styles.content}>
          <ShimmerPlaceHolder style={{ marginVertical: 5 }} autoRun={true}/>
          <ShimmerPlaceHolder style={{ marginVertical: 5 }} autoRun={true}/>
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => NavigationService.navigate('ChatThread', { conversationId: chat.conversationId })}
    >
      <Image
        source={{ uri: placeHolderImage }}
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
