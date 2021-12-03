import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  Login, 
  Splash, 
  Register,
  Home
 } from '../screens';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
  </Stack.Navigator>
)

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home}/>
  </Stack.Navigator>
)

const Router = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Auth" component={AuthStack}/>
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  )
}

export default Router
