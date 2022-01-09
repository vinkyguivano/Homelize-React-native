import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import { TextInput, PrimaryButton } from '../../../components'
import AuthContext from '../../../context/AuthContext'
import { font, color, api } from '../../../utils';

const ProfessionalLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disable, setDisable] = useState(true)
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })
  const [errorMsg, setErrorMsg] = useState('')
  const { signIn } = useContext(AuthContext)
  let emailRef, passwordRef;

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

  const onSubmit = async () => {
    setDisable(true)

    const body = {
      email: email,
      password: password
    }

    try {
      let res = await api.post('professional/login', null, body)
      res= res.data;
      await signIn(res)
    } catch (error) {
      let err = error?.response?.data
      if(err?.message === "The provided credentials are incorrect"){
        setErrorMsg('Email dan password tidak sesuai');
      }else{
        setErrorMsg('Gagal login, silahkan coba beberapa saat lagi');
      }
      setDisable(false);
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={styles.container}>
        <Text style={styles.title}>Login Professional</Text>
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
        <View style={styles.loginContainer}>
          <Text style={styles.loginText1}>Belum punya akun mitra?
            <Text
              style={styles.loginText2}
              onPress={() => navigation.navigate('Register Professional')}> Daftar disini!</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ProfessionalLogin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 20
  },
  loginContainer: {
    marginTop: 'auto',
  },
  loginText1: {
    fontFamily: font.primary,
    color: color.black,
    fontSize: 14,
    textAlign: 'center'
  },
  loginText2: {
    color: color.primary
  },
  title:{
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginTop: Dimensions.get('window').height * 0.035
  }
})
