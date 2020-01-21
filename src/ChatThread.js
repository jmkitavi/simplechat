import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import NavigationService from './NavigationService'

const ChatThread = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => NavigationService.navigate('ChatList', {})}
      >
        <Text>Chat Thread</Text> 
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E8E8',
  },
})

export default ChatThread
