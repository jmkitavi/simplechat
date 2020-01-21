import React from 'react'
import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native'
import firebase from 'react-native-firebase'

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props)

    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        return this.props.navigation.navigate('MainNav')
      }

      return this.props.navigation.navigate('Login')
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
})

export default AuthLoadingScreen
