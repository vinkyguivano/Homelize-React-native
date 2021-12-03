import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  storeData : async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key , jsonValue)
    } catch (e) {
      console.log("Error store data : " + e)
    }
  },

  getData : async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      return value != null ? JSON.parse(value) : null;
    } catch (e) {
      // error reading value
      console.log("Error read data : " + e)
    }
  },

  removeData : async (key) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      console.log("Error remove data : " + e)
    }
  },

  getAllKeys : async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys()
    } catch(e) {
      // read key error
    }
  
    console.log(keys)
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  },

  clearAll : async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Done.')
  }
  
  
}

export default storage
