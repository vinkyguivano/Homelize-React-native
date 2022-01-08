import React, { useState, useEffect } from 'react';
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import {
  GraphRequest,
  GraphRequestManager, LoginManager
} from 'react-native-fbsdk';

import {
  GoogleSignin,
  statusCodes
} from 'react-native-google-signin'

import { Facebook, Google, PrimaryButton, TextInput } from '../../../components';
import AuthContext from '../../../context/AuthContext';
import { color, font, api } from '../../../utils';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disable, setDisable] = useState(true)
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const [errorMsg, setErrorMsg] = useState('')
  const { signIn } = React.useContext(AuthContext)
  let emailRef, passwordRef;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "786926213150-jc9vhgr8o97sth41fbvii1ttdoo9k31k.apps.googleusercontent.com"
    })
  }, [])

  const onChangeEmail = () => {
    let validEmail = ''
    if (!(/^[\d\w\s.!]+@{1}.+\.{1}.{2,3}$/.test(email))) {
      validEmail = 'Format email salah'
    }
    if (email.length === 0) {
      validEmail = 'Email tidak boleh kosong'
    }

    if (validEmail) {
      setDisable(true);
      setErrors((prev) => ({ ...prev, email: validEmail }))
    } else {
      setErrors((prev) => ({ ...prev, email: '' }))
      setDisable(checkError('email'))
    }
  }

  const onChangePassword = async () => {
    let validPassword = ''
    if (password.length === 0) {
      validPassword = "Password tidak boleh kosong"
    }

    if (validPassword) {
      setDisable(true);
      setErrors((prev) => ({ ...prev, password: validPassword }))
    } else {
      setErrors((prev) => ({ ...prev, password: '' }))
      setDisable(checkError('password'))
    }
  }

  const toogleEye = () => {
    setPasswordVisible((prev) => {
      return !prev
    });
  }

  const checkError = (field) => {
    if (!email || !password) {
      return true;
    }

    if (field != "email" && errors.email) {
      return true;
    }

    if (field != "password" && errors.password) {
      return true;
    }

    return false;
  }

  const onSubmit = async() => {

    setDisable(true)

    const body = {
      email: email,
      password: password
    }

    try {
      let res = await api.post('login', null, body)
      res= res.data;
      await signIn(res)
    } catch (error) {
      let err = error?.response?.data
      if(err?.message === "Bad credentials"){
        setErrorMsg('Email dan password tidak sesuai');
      }else if (err?.message ==="User not found"){
        setErrorMsg('Email belum terdaftar');
      }else{
        setErrorMsg('Gagal login, silahkan coba beberapa saat lagi');
      }
      setDisable(false);
    }
  }

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
      let res = await api.post('login/google', null, data);
      res = res.data;
      console.log(res);
      await signIn(res)

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

  const infoRequest = new GraphRequest(
    '/me',
    {
      parameters: {
        'fields': {
          'string': 'email,name,id,picture'
        }
      }
    },
    async (err, res) => {
      if (err) {
        console.log(err);
      } else {
        const body = {
          name: res.name,
          email: res.email,
          id: res.id,
          avatar: res.picture.data.url
        }
        try {
          let res2 = await api.post('login/facebook', null, body)
          res2 = res2.data
          await signIn(res2)
        } catch (e) {
          console.log(e);
        }
      }
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={styles.container}>
        <View style={{ width: '100%' }}>
          <TextInput
            label="Email"
            textInputRef={input => emailRef = input}
            onChangeText={(text) => { setEmail(text); setDisable(true) }}
            onSubmitEditing={() => passwordRef.focus()}
            onEndEditing={onChangeEmail}
            keyboardType={'email-address'}
            error={errors.email}
          />
          <TextInput
            label="Password"
            secureTextEntry={!passwordVisible}
            textInputRef={input => passwordRef = input}
            onChangeText={(text) => { setPassword(text); setDisable(true) }}
            onEndEditing={onChangePassword}
            error={errors.password}
            password={true}
            onClickEye={toogleEye}
            passwordVisible={passwordVisible}
          />
          {
            errorMsg ?
              <Text style={
                {
                  fontFamily: font.primary,
                  color: 'red',
                  marginTop: 10
                }}>{errorMsg}</Text>
              : null
          }
          <PrimaryButton
            isDisabled={disable}
            onPress={onSubmit}
            title="Log In"
            marginTop={29} />
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
              onPress={() => navigation.navigate('Register')}> Buat Akun dulu yuk!</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
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