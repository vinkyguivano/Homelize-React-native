import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Login,
  Splash,
  Register,
  Home,
  Order,
  Chat,
  Profile
} from '../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { color } from '../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName
        if(route.name === "Home"){
          iconName = focused ? 'home' : 'home-outline'
        }else if (route.name === "Order"){
          iconName = focused ? 'calendar-text' : 'calendar-text-outline'
        }else if(route.name === "Chat") {
          iconName = focused ? 'chat' : 'chat-outline'
        }else if(route.name === "Profile"){
          iconName = focused ? 'account-circle' : 'account-circle-outline'
        }

        return <Icon name={iconName} color={color} size={size}  />
      },
      tabBarActiveTintColor : color.primary,
      tabBarInactiveTintColor: 'gray',
      headerShown: false
    })} >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Order" component={Order} />
    <Tab.Screen name="Chat" component={Chat} />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
)

const Router = ({ state }) => {
  return (
    <Stack.Navigator>
      {
        state.isLoading ? 
        (
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        ) 
        : !state.userToken ? 
        (
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
                animationTypeForReplace: state.isSignout ? 'pop' : 'push'
              }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </Stack.Group>
        ) 
        : 
        (
          <Stack.Group>
            <Stack.Screen name="Tab" component={MainTabScreen} options={{ headerShown: false }} />
          </Stack.Group>
        )
      }

    </Stack.Navigator>
  )
}

export default Router
