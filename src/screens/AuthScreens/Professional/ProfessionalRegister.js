import React, { useState, useContext, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { TextInput, PrimaryButton } from '../../../components'
import AuthContext from '../../../context/AuthContext'
import { font, color, api } from '../../../utils';
import * as Modal from '../../../components/Modal'

const ProfessionalRegister = ({ navigation }) => {
  const [category, setCategory] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disable, setDisable] = useState(true)
  const [isModalVisible, setModalVisible] = useState(false)
  const typeList = [
    { id: 1, name: 'Arsitek' },
    { id: 2, name: 'Desainer Interior' },
    { id: 3, name: 'Arsitek & Desainer Interior' }
  ]
  const [errors, setErrors] = useState({
    category: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState('')
  const { signIn } = useContext(AuthContext)
  let categoryRef, companyNameRef, emailRef, phoneNumberRef, passwordRef

  const onChangeType = (typeId) => {
    if(!typeId){
      setDisable(true)
      setErrors(prev => ({...prev, category: 'Kategori wajib dipilih'}))
    }else{
      setCategory(typeId)
      const name = typeList.find(item => item.id === typeId).name
      categoryRef.setValue(name)
      setModalVisible(false)
      setErrors((prev) => ({ ...prev, category: '' }))
    }
  }

  useEffect(() => {
    setDisable(checkError('category'))
  }, [category])

  const onChangeName = () => {
    let validName = ''
    if (companyName.trim().length < 3) {
      validName = "Panjang nama minimal 3 karakter"
    }

    if (validName) {
      setDisable(true);
      setErrors((prev) => ({ ...prev, companyName: validName }))
    } else {
      setErrors((prev) => ({ ...prev, companyName: '' }))
      setDisable(checkError('companyName'))
    }
  }

  const onChangeEmail = () => {
    let validEmail = ''
    if (!(/^[\d\w.!]+@{1}.+\.{1}.{2,3}$/.test(email))) {
      validEmail = 'Format email tidak valid'
    }
    if (email.trim().length === 0) {
      validEmail = 'Email wajib diisi'
    }

    if (validEmail) {
      setDisable(true);
      setErrors((prev) => ({ ...prev, email: validEmail }))
    } else {
      setErrors((prev) => ({ ...prev, email: '' }))
      setDisable(checkError('email'))
    }
  }

  const onChangePhoneNumber = () => {
    let validPhoneNumber = ''
    if (phoneNumber.trim().length === 0) {
      validPhoneNumber = 'Nomor telepon wajib diisi'
    } else if (!(/^(62|0){1}8{1}\d{7,11}$/).test(phoneNumber)) {
      validPhoneNumber = 'Format telepon tidak valid'
    }

    if (validPhoneNumber) {
      setDisable(true)
      setErrors((prev) => ({ ...prev, phoneNumber: validPhoneNumber }))
    } else {
      setErrors(prev => ({ ...prev, phoneNumber: '' }))
      setDisable(checkError('phoneNumber'))
    }
  }

  const onChangePassword = () => {
    let validPassword = ''
    if (password.length < 6) {
      validPassword = "Panjang password minimal 6 karakter "
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
    if (!companyName || !email || !password || !category || !phoneNumber) {
      return true;
    }

    if (field != "companyName" && errors.companyName) {
      return true;
    }

    if (field != "email" && errors.email) {
      return true;
    }

    if (field != "password" && errors.password) {
      return true;
    }

    if (field != "phoneNumber" && errors.phoneNumber) {
      return true;
    }

    if (field != 'category' && errors.category) {
      return true;
    }

    return false;
  }

  const toggleModal = () => setModalVisible(!isModalVisible)

  const onModalClose = () => {
    onChangeType(category)
    toggleModal()
  }

  const onSubmit = async () => {
    setDisable(true);
    const body = {
      professional_type_id : category,
      name : companyName,
      phone_number : phoneNumber,
      email,
      password
    }

    try {
      let res = await api.post('professional/register', null, body);
      res = res.data;
      await signIn(res)
    }
    catch (error) {
      let err = error?.response?.data;
      if (err?.errors?.email) {
        setErrorMessage('Email telah terdaftar');
      } else {
        setErrorMessage('Registrasi gagal, silahkan coba beberapa saat lagi');
      }

      setDisable(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
          <Text style={styles.title}>Daftar Professional</Text>
          <View>
            <TouchableOpacity onPress={toggleModal} activeOpacity={.7}>
              <TextInput
                textInputRef={input => categoryRef = input}
                label="Pilih Kategori"
                value={category?.name}
                editable={false}
                select
                error={errors.category}
              />
            </TouchableOpacity>
            <Modal.Secondary
              isVisible={isModalVisible}
              optionList={typeList}
              label={"Pilih Kategori"}
              toggleModal={onModalClose}
              selectedOption={category}
              onChange={onChangeType}
            />
            <TextInput
              label="Nama Perusahaan"
              textInputRef={input => companyNameRef = input}
              onChangeText={(text) => { setCompanyName(text); setDisable(true) }}
              onSubmitEditing={() => emailRef.focus()}
              onEndEditing={onChangeName}
              error={errors.companyName}
            />
            <TextInput
              label="Email"
              textInputRef={input => emailRef = input}
              onChangeText={(text) => { setEmail(text); setDisable(true) }}
              onSubmitEditing={() => phoneNumberRef.focus()}
              onEndEditing={onChangeEmail}
              keyboardType={'email-address'}
              error={errors.email}
            />
            <TextInput
              label="Nomor telepon"
              textInputRef={input => phoneNumberRef = input}
              onChangeText={(text) => { setPhoneNumber(text); setDisable(true) }}
              onSubmitEditing={() => passwordRef.focus()}
              onEndEditing={onChangePhoneNumber}
              keyboardType={'number-pad'}
              error={errors.phoneNumber}
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
              errorMessage ?
                <Text style={
                  {
                    fontFamily: font.primary,
                    color: 'red',
                    marginTop: 10
                  }}>{errorMessage}</Text>
                : null
            }
            <PrimaryButton
              isDisabled={disable}
              onPress={onSubmit}
              title="Daftar"
              marginTop={29} />
          </View>
        </ScrollView>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText1}>Udah punya akun mitra?
            <Text
              style={styles.loginText2}
              onPress={() => navigation.navigate('Login Professional')}> Langsung log in aja!</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ProfessionalRegister

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
    paddingTop: 20
  },
  loginText1: {
    fontFamily: font.primary,
    color: color.black,
    fontSize: 14
  },
  loginText2: {
    color: color.primary
  },
  title:{
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginTop: Dimensions.get('window').height * 0.035,
    textAlign: 'center'
  }
})
