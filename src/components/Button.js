import { Dimensions, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { GoogleSigninButton } from "react-native-google-signin"
import { FacebookIcon, GoogleIcon } from '../assets/icons'
import { StyleSheet } from "react-native"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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

const PrimaryButton = ({ 
                onPress, 
                title, 
                isDisabled, 
                height, 
                width, 
                marginTop,
                marginRight,
                marginLeft,
                marginBottom,
                marginHorizontal,
                marginVetical,
                padding,
                paddingHorizontal,
                paddingVertical,
                fontStyle,
                flex,
                arrowRight,
                arrowLeft }) => (
  <TouchableNativeFeedback onPress={onPress} disabled={isDisabled || false}>
    <View style={{
      backgroundColor: !isDisabled ?  color.primary : color.disabled,
      justifyContent: 'center',
      borderRadius: 10,
      height: height || Dimensions.get('window').height * 0.065,
      width, 
      flex,
      marginTop,
      marginRight,
      marginLeft,
      marginBottom,
      marginHorizontal,
      marginVetical,
      padding,
      paddingHorizontal,
      paddingVertical
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        { arrowLeft && <Icon name="arrow-left" size={18} style={styles.arrowLeft} />}
        <Text style={{textAlign: 'center', fontFamily: font.primary, fontSize: 16, color: color.white, ...fontStyle}}>
          {title}
        </Text>
        { arrowRight && <Icon name="arrow-right" size={18} style={styles.arrowRight} /> }
      </View>
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
  },
  arrowRight: {
    marginLeft: 8,
    color: 'white'
  },
  arrowLeft: {
    marginRight: 8,
    color: 'white'
  }
})