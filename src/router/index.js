import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Login,
  Splash,
  Register,
  Home,
  Order,
  Chat,
  Profile,
  Design,
  Professional
} from '../screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { color, font } from '../utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dimensions } from 'react-native';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

const CatalogueTabs = () => {
  return (
    <TopTab.Navigator
      initialLayout={{ width: Dimensions.get('window').width }}
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: font.primary
        },
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          borderBottomWidth: 3,
          borderBottomColor: color.primary
        },
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: 'grey',
        lazy: true,
      }}
    >
      <TopTab.Screen name="Design" component={Design} options={{ title: 'Desain'}} />
      <TopTab.Screen name="Professional" component={Professional} options={{ title: 'Professional' }} />
    </TopTab.Navigator>
  )
}

const MainTabs = () => (
  <BottomTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName
        if (route.name === "Home") {
          iconName = focused ? 'home' : 'home-outline'
        } else if (route.name === "Order") {
          iconName = focused ? 'calendar-text' : 'calendar-text-outline'
        } else if (route.name === "Chat") {
          iconName = focused ? 'chat' : 'chat-outline'
        } else if (route.name === "Profile") {
          iconName = focused ? 'account-circle' : 'account-circle-outline'
        }

        return <Icon name={iconName} color={color} size={size} />
      },
      tabBarActiveTintColor: color.primary,
      tabBarInactiveTintColor: 'gray',
      headerShown: false
    })} >
    <BottomTab.Screen name="Home" component={Home} />
    <BottomTab.Screen name="Order" component={Order} />
    <BottomTab.Screen name="Chat" component={Chat} />
    <BottomTab.Screen name="Profile" component={Profile} />
  </BottomTab.Navigator>
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
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="Catalogue" component={CatalogueTabs} options={{ headerTitle: "Katalog" }} />
              </Stack.Group>
            )
      }
    </Stack.Navigator>
  )
}

export default Router
