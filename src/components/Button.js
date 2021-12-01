import { Dimensions, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { GoogleSigninButton } from "react-native-google-signin"
import { FacebookIcon, GoogleIcon } from '../assets/icons'
import { StyleSheet } from "react-native"
import React from "react"
import font from "../utils/font"
import color from "../utils/color"

const Facebook = ({ onPress, style }) => (
  <TouchableNativeFeedback 
    onPress={onPress} >
    <View  style={[styles.FacebookContainer, style ]}>
      <FacebookIcon width={34} height={34} style={{ marginRight: 7 }} />
      <Text style={styles.FacebookText}>Facebook</Text>
    </View>
  </TouchableNativeFeedback>
)

const Google = ({ onPress, style }) => (
  <TouchableNativeFeedback onPress = {onPress}>
    <View style = {[styles.FacebookContainer, style]}>
      <GoogleIcon width={34} height={34} style={{ marginRight: 7 }}  />
     <Text style={styles.FacebookText}>Google</Text>
    </View>
  </TouchableNativeFeedback>
)

const PrimaryButton = ({ onPress, style, title, isDisabled }) => (
  <TouchableNativeFeedback onPress={onPress} disabled={isDisabled || false}>
    <View style={[
      {backgroundColor: !isDisabled ?  color.primary : color.disabled,
        justifyContent: 'center',
        height: Dimensions.get('window').height * 0.065,
      },
      style
    ]}>
      <Text style={{textAlign: 'center', fontFamily: font.primary,
    fontSize: 16, color: color.white}}>{title}</Text>
    </View>
    </TouchableNativeFeedback>
)

export {
  Facebook,
  Google,
  PrimaryButton
}


const styles = StyleSheet.create({
  FacebookContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#000000',
    height: 50,
    maxWidth: 220
  },
  FacebookText:{
    fontFamily: font.primary,
    color: color.black,
    fontSize: 16
  }
})