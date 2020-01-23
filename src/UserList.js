import React, { useEffect, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import firebase from 'react-native-firebase'
import NavigationService from './NavigationService'

const ChatList = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userList, setUserList] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return NavigationService.navigate("Login")
      }

      setCurrentUser(user)

      if (!userList) {
        fetchUserList()
      }
    })
  })

  fetchUserList = () => {
    firebase.database().ref(`users/`).on('value', (snapshot) => {
      if (snapshot.val()) {
        let userList =  Object.values(snapshot.val())
        setUserList(userList)
      }
    })
  }

  renderUserList = (userList) => {
    return userList.map((user) => {
      if (user.uid === currentUser.uid) return null

      return (
        <TouchableOpacity
          style={styles.userItem}
          onPress={() => NavigationService.navigate('ChatThread', { recepientId: user.uid })}
        >
          <Text>{user.email ? user.email : user.uid}</Text>
        </TouchableOpacity>
      )
    }
    )
  }

  return (
    <View style={styles.container}>
      {!currentUser ? (
        <ActivityIndicator />
      ) : (
      <View>
        <Text>{`Email: ${currentUser.email ? currentUser.email : 'Anon User'}`}</Text>
        <Text>{`Unique Identifier: ${currentUser.uid}`}</Text>
        <TouchableOpacity
          onPress={() => NavigationService.navigate('ChatList')}
          style={styles.createButton}
        >
          <Text>CHAT LIST</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 10 }}>
          {userList ? renderUserList(userList) : <ActivityIndicator />}
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
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  }
})

export default ChatList
