import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { createAppContainer } from 'react-navigation'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'
import { Transition } from 'react-native-reanimated'
import { createStackNavigator } from 'react-navigation-stack'
import AuthLoading from './AuthLoading'
import ChatList from './ChatList'
import Login from './Login'
import ChatThread from './ChatThread'
import UserList from './UserList'
import NavigationService from './NavigationService'

const MainNav = createStackNavigator(
  {
    ChatList,
    ChatThread,
    UserList,
  },
  {
    initialRouteName: 'ChatList',
  }
)

const SwitchNav = createAnimatedSwitchNavigator(
  {
    AuthLoading,
    MainNav,
    Login,
  },
  {
    initialRouteName: 'AuthLoading',

    // The previous screen will slide to the bottom while the next screen will fade in
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-bottom"
          durationMs={400}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={500} />
      </Transition.Together>
    ),
  }
)

const AppNav = createAppContainer(SwitchNav)

class App extends React.Component {
  render() {
    return (
      <KeyboardAvoidingView enabled style={{ flex: 1 }}>
        <AppNav
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}
        />
      </KeyboardAvoidingView>
    )
  }
}

export default App
