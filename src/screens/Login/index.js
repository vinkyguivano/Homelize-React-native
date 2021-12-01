import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import {
  GraphRequest,
  GraphRequestManager, LoginManager
} from 'react-native-fbsdk';

import {
  GoogleSignin,
  statusCodes
} from 'react-native-google-signin'

import color from '../../utils/color';
import font from '../../utils/font';
import { Facebook, Google, PrimaryButton, TextInput } from '../../components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disable, setDisable] = useState(true)
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  let emailRef, passwordRef;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "786926213150-jc9vhgr8o97sth41fbvii1ttdoo9k31k.apps.googleusercontent.com"
    })
  }, [])

  const signInGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { user } = await GoogleSignin.signIn();
      const data = {
        name: user.name,
        email: user.email,
        id: user.id,
        avatar: user.photo
      }
      console.log(data)
      // const res = await fetch('http://127.0.0.1:8000/api/login/google', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Accept': 'application/json',
      //   },
      //   body: JSON.stringify(data)
      // })

      // if (res.status === 200) {
      //   let user = await res.json();
      //   setuserInfo(user)
      //   setloggedIn(true);
      // }

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sigin on progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('PLAY SERVICES NOT AVAILABLE');
      } else {
        console.log(error)
      }
    }
  }

  const signOut = async () => {
    try {
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      await LoginManager.logOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  }

  const infoRequest = new GraphRequest(
    '/me',
    {
      parameters: {
        'fields': {
          'string': 'email,name,id,picture'
        }
      }
    },
    (err, res) => {
      console.log(err, res);
    }
  );

  const facebookLogin = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Login cancelled");
        }
        else {
          console.log("Login success with permissions: " + result.grantedPermissions.toString());
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        console.log("Login fail with error: " + error);
      }
    );
  }

  const onChangeEmail = () => {
    let validEmail = ''
    if(!(/^[\d\w\s.!]+@{1}.+\.{1}.{2,3}$/.test(email))){
      validEmail= 'Format email salah'
    }
    if(email.length === 0){
      validEmail = 'Email tidak boleh kosong'
    }

    if(validEmail){
      setDisable(true);
      setErrors((prev) => ({...prev, email: validEmail}))
    }else{
      setErrors((prev) => ({...prev, email: ''}))
      setDisable(checkError())
    }
  }

  const onChangePassword = () => {
    console.log("hELLO")
    let validPassword = ''
    if(password.length === 0){
      validPassword = "Password tidak boleh kosong"
    }

    if(validPassword){
      setDisable(true);
      setErrors((prev) => ({...prev, password: validPassword}))
    }else{
      setErrors((prev) => ({...prev, password: ''}))
      setDisable(checkError())
    }
  }

  const checkError = () => {
    if(errors.email || errors.password){
      return true;
    }

    return false;
  }

  const onSubmit = () => {
    console.log('Hi')
  }

  return (
    <View
      style={styles.container}>
      <View style={{ width: '100%' }}>
        <TextInput
          label="Email" 
          textInputRef={input => emailRef = input}
          onChangeText={setEmail}
          onSubmitEditing={() => passwordRef.focus()}
          onEndEditing={onChangeEmail}
          keyboardType={'email-address'}
          error={errors.email}
          />
        <TextInput
          label="Password"
          secureTextEntry={!passwordVisible}
          textInputRef={input => passwordRef = input}
          onChangeText={setPassword} 
          onEndEditing={onChangePassword}
          error={errors.password}
          />

        <PrimaryButton
          isDisabled={disable} 
          onPress={onSubmit}
          title="Log In"
          style={{marginTop: 29}}/>
      </View>
      <View style={{ flexDirection: 'row', marginVertical: 24 }}>
        <View style={styles.border} />
        <Text style={styles.subText}>Atau login dengan</Text>
        <View style={styles.border} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Google onPress={signInGoogle} style={{ flex: 1, marginRight: 20 }} />
        <Facebook onPress={facebookLogin} style={{ flex: 1, marginLeft: 20 }} />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText1}>Belum punya akun?
          <Text
            style={styles.loginText2}
            onPress={() => console.log('hello')}> Buat Akun dulu yuk!</Text>
        </Text>
      </View>
    </View>
  );
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 20
  },
  border: {
    flex: 1,
    width: 30,
    height: 10,
    borderBottomWidth: 2
  },
  subText: {
    fontFamily: font.primary,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    marginHorizontal: 25,
    color: color.black
  },
  loginContainer: {
    marginTop: 'auto',
  },
  loginText1: {
    fontFamily: font.primary,
    color: color.black,
    fontSize: 14
  },
  loginText2: {
    color: color.primary
  }
})