import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database'

const config = {
  apiKey: "AIzaSyDtWWxpxsR9TrKSK3AKXfd47Cd_hwHTgC0",
  authDomain: "homelize-333512.firebaseapp.com",
  databaseURL: "https://homelize-333512-default-rtdb.firebaseio.com",
  projectId: "homelize-333512",
  storageBucket: "homelize-333512.appspot.com",
  messagingSenderId: "786926213150",
  appId: "1:786926213150:web:89eca53470af02fe80760f",
  measurementId: "G-1J282XQT6X"
};

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    } else {
      console.log("firebase apps already running....")
    }
    this.ref = ''
  }

  set _ref(ref) {
    this.ref = ref
  }

  get _ref() {
    return database().ref(this.ref)
  }

  parse = snapshot => {
    const { text, user, createdAt } = snapshot.val()
    const { key: _id } = snapshot

    const message = {
      _id,
      text,
      createdAt,
      user,
      sent: true
    }

    return message
  }

  refOn = callback => {
    return this._ref
      .limitToLast(50)
      .on('child_added', snapshot => callback(this.parse(snapshot)))
  }

  get timestamp(){
      return database.ServerValue.TIMESTAMP
  }

  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this._ref.push(message);
    }
  }

  refOff(){
    this._ref.off()
  }
}

const FirebaseSrvc = new Firebase();
export default FirebaseSrvc
