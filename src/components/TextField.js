import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  OutlinedTextField,
} from 'react-native-material-textfield';
import color from '../utils/color';
import font from '../utils/font';
import { EyeClose, EyeOpen } from '../assets/icons';

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

  let { password, onClickEye, passwordVisible } = props;

  return (
    <View style={{marginTop: Dimensions.get('window').height * 0.035}}>
      <OutlinedTextField
        {...props}
        ref = {getRefHandler()}
        label = {props.label}
        labelTextStyle = {{fontFamily: font.primary}}
        style = {{fontFamily: font.primary}}
        fontSize={14}
        tintColor={color.primary}
        baseColor={color.black}
        renderRightAccessory = { () => {
          if(password)
            return (
              <TouchableOpacity onPress={onClickEye}>
                <Image source={ !passwordVisible ?  EyeClose : EyeOpen } style={{width: 20, height: 20}}/>
              </TouchableOpacity>
            )
        }}
      />
    </View>
  )
}

export {
  TextInput
}
const styles = StyleSheet.create({})
