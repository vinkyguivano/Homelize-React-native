import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';
import color from '../utils/color';
import font from '../utils/font';

const TextInput = (props) => {
  let inputRef;

  const getRefHandler = () => {
    if (props.textInputRef) {
      return input => {
        inputRef = input;
        props.textInputRef(input);
      }
    }
  }

  return (
    <View style={{marginTop: 23}}>
      <OutlinedTextField
        {...props}
        ref = {getRefHandler()}
        label = {props.label}
        labelTextStyle = {{fontFamily: font.primary}}
        style = {{fontFamily: font.primary}}
        fontSize={14}
        tintColor={color.primary}
        baseColor={color.black}
      />
    </View>
  )
}

export {
  TextInput
}
const styles = StyleSheet.create({})
