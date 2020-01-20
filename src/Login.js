import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native'
import firebase from 'react-native-firebase'
import { NavigationActions } from 'react-navigation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  loginWithEmail = () => {
    if (email !== '' && password !== '') {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          return NavigationActions.navigate("Home", { user })
        })
        .catch((error) => {
          // if no user create one
          if (error.code === "auth/user-not-found") {
            ToastAndroid.showWithGravityAndOffset(
              "Couldn't find user. Creating one.",
              ToastAndroid.SHORT, ToastAndroid.TOP,
              0, 100
            )
            return firebase.auth().createUserWithEmailAndPassword(email, password)
              .then((user) => {
                return NavigationActions.navigate("Home", { user })
              })
              .catch((error) => {
                ToastAndroid.showWithGravityAndOffset(
                  error.message,
                  ToastAndroid.LONG, ToastAndroid.TOP,
                  0,100
                )
              })
          }

          ToastAndroid.showWithGravityAndOffset(
            error.message,
            ToastAndroid.LONG, ToastAndroid.TOP,
            0, 100
          )
        })
    }
  }

  loginAnonymously = () => {
    Alert.alert(
      'Anonymously Login',
      'You can not recover messages after logging out. Use email (recommended).',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue',
          onPress: () => {
            firebase.auth().signInAnonymously()
              .then((user) => {
                NavigationActions.navigate("Home", { user })
              })
          }
        },
      ],
      {cancelable: false},
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email Address"
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <TouchableOpacity
        onPress={() => loginWithEmail()}
        style={styles.buttons}
      >
        <Text>AUTH WITH EMAIL</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => loginAnonymously()}
        style={[styles.buttons, { position: 'absolute', bottom: 40 }]}
      >
        <Text>AUTH ANONYMOUSLY</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8'
  },
  inputContainer: {
    width: '80%',
    height: 40,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: 'black',
    fontSize: 15,
  },
  buttons: {
    width: '50%',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A0A0A0',
    margin: 10,
    padding: 5,
  }
})

export default Login
