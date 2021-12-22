import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import Router from './router';
import { storage } from './utils';
import AuthContext from './context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message';
import { Host } from 'react-native-portalize' 

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            user: action.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            user: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      user: null,
    }
  );


  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let user;

      try {
        const res = await storage.getData("client_data");
        user = res
      } catch (e) {
        user = null
      }

      dispatch({ type: 'RESTORE_TOKEN', user: user });
    };

    setTimeout(() => {
      bootstrapAsync();
    }, 2000)
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        await storage.storeData("client_data", data)
        dispatch({ type: 'SIGN_IN', user: data });
      },
      signOut: async () => {
        await storage.removeData("client_data")
        dispatch({ type: 'SIGN_OUT' })
      },
      user: state.user
    }),
    [state.user]
  );

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Host>
            <Router state={state} />
          </Host>
        </NavigationContainer>
        <FlashMessage position={"top"}/>
      </AuthContext.Provider>
    </SafeAreaProvider>
  )
}

export default App
