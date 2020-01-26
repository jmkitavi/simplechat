import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import NavigationService from './NavigationService'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import moment from 'moment'

const placeHolderImage = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'

const UserItem = ({ user }) => {
  if (!user) {
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
      onPress={() => NavigationService.navigate('ChatThread', { recepientId: user.uid })}
    >
      <Image
        source={{ uri: placeHolderImage }}
        style={styles.profile}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{user.isAnonymous ? 'Anon User' : user.email}</Text>
        <Text>Last seen {moment(user.lastSeen, "YYYYMMDD").fromNow()}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 15,
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
    lineHeight: 25,
    fontWeight: 'bold',
  }
})

export default UserItem
