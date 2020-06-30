import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import Home from './pages/Home'
import Historic from './pages/Historic'

import FirstScreen from './pages/Access/FirstScreen'
import Login from './pages/Access/Login'
import Register from './pages/Access/Register'

import { DrawerContent } from './pages/Components/drawerContent'

const Routes = () => {
    const Drawer = createDrawerNavigator()
    const Stack = createStackNavigator()


    function Drawers() {
      return (
      <Drawer.Navigator initialRouteName="Inicio" drawerContent={ props => <DrawerContent {...props} />} >
        <Drawer.Screen name="Inicio" component={Home} />
        <Stack.Screen name="Historic" component={Historic} />
      </Drawer.Navigator>
      )
    }

    return (
      <NavigationContainer>
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="FirstScreen" component={FirstScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Drawers} />
          </Stack.Navigator>
      </NavigationContainer>
    )
  }

  export default Routes