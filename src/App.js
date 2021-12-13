import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import Router from './router';
import { storage } from './utils';
import AuthContext from './context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import FlashMessage from 'react-native-flash-message';

const App = () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );


  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        const res = await storage.getData("client_data");
        userToken = res?.token
      } catch (e) {
        userToken = null
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    setTimeout(() => {
      bootstrapAsync();
    }, 2000)
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        await storage.storeData("client_data", data)
        dispatch({ type: 'SIGN_IN', token: data.token });
      },
      signOut: async () => {
        await storage.removeData("client_data")
        dispatch({ type: 'SIGN_OUT' })
      },
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <Router state={state} />
        </NavigationContainer>
        <FlashMessage position={"top"}/>
      </AuthContext.Provider>
    </SafeAreaProvider>
  )
}

export default App
