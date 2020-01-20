import React, { useEffect, useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import firebase from 'react-native-firebase'
import { NavigationActions } from 'react-navigation'

const Home = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        return NavigationActions.navigate("Login")
      }

      setUser(user)
    })
  })

  return (
    <View style={styles.container}>
      {!user ? (
        <ActivityIndicator />
      ) : (
      <View>
        <Text>{`Email: ${user.email}`}</Text>
        <Text>{`Unique Identifier: ${user.uid}`}</Text>
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
