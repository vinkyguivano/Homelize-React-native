import React, { useState, useEffect, useContext, useLayoutEffect }from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import AuthContext from '../../../context/AuthContext'
import * as Container from '../../../components/Container'
import * as Text from '../../../components/Text'
import * as Button from '../../../components/Button'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as TextField from '../../../components/TextField'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width , height } = Dimensions.get('window')

const InteriorServiceOrder = () => {
  const { user } = useContext(AuthContext)

  return (
    <Container.Main>
      <KeyboardAwareScrollView>
        <Text.Main>Form jasa desain interior</Text.Main>
      </KeyboardAwareScrollView>
    </Container.Main>
  )
}

export default InteriorServiceOrder

const styles = StyleSheet.create({})
