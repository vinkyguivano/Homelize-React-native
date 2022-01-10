import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput as TextInput1 } from 'react-native'
import {
  OutlinedTextField,
} from 'react-native-material-textfield';
import color from '../utils/color';
import font from '../utils/font';
import { EyeClose, EyeOpen } from '../assets/icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export const TextInput = (props) => {
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
    <View style={{ marginTop: Dimensions.get('window').height * 0.035 }}>
      <OutlinedTextField
        {...props}
        ref={getRefHandler()}
        label={props.label}
        labelTextStyle={{ fontFamily: font.primary }}
        style={{ fontFamily: font.primary }}
        fontSize={14}
        tintColor={color.primary}
        baseColor={color.black}
        renderRightAccessory={() => {
          if (password)
            return (
              <TouchableOpacity onPress={onClickEye}>
                <Image source={!passwordVisible ? EyeClose : EyeOpen} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            )
          if (props.select)
            return (
              <Icon name="chevron-down" size={24} color={'black'}/>
            )
        }}
      />
    </View>
  )
}
const styles = StyleSheet.create({})


export const Form = React.forwardRef((props, ref) => {
  const { flex, dropdown, onDropdownPress, suffix, prefix } = props
  return (
    <View style={{ marginBottom: 25, flex }}>
      {
       props.label && (
        <Text style={{
          ...styles2.label, ...props.error && {
            color: '#cc0000',
          }
        }}>{props.label}</Text>
       ) 
      }
      <View style={{ justifyContent: 'center' }}>
        {dropdown ?
          <>
            <TouchableOpacity onPress={onDropdownPress}>
              <TextInput1
                {...props}
                style={{
                  ...styles2.textInput, ...props.error && {
                    borderBottomColor: '#cc0000',
                    borderBottomWidth: 1
                  }
                }}
              />
              {dropdown && <Icon name='chevron-down' size={20} style={styles2.suffix} />}
            </TouchableOpacity>
          </>
          :
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {
                prefix && (
                  <Text style={{
                    ...styles2.prefixText, ...props.error && {
                      color: '#cc0000',
                    }
                  }}>
                    {prefix}
                  </Text>
                )
              }
              <TextInput1
                {...props}
                style={{
                  ...styles2.textInput, ...props.error && {
                    borderBottomColor: '#cc0000',
                    borderBottomWidth: 1
                  },
                  flex: 1
                }}
              />
              {
                suffix && (
                  <Text style={{
                    ...styles2.suffixText, ...props.error && {
                      color: '#cc0000',
                    }
                  }}>
                    {suffix}
                  </Text>
                )
              }
            </View>
          </>
        }
      </View>
      {
        props.error ? (
          <View>
            <Text style={styles2.textError}>{props.error}</Text>
          </View>
        ) : null
      }
    </View>
  )
})

const styles2 = StyleSheet.create({
  label: {
    fontSize: 15,
    fontFamily: font.secondary,
    color: 'black',
    marginBottom: 5
  },
  textInput: {
    borderBottomColor: 'darkgrey',
    borderBottomWidth: .6,
    fontSize: 15,
    fontFamily: font.secondary,
    paddingVertical: 2,
    paddingLeft: 0,
    color: 'black'
  },
  textError: {
    fontFamily: font.secondary,
    fontSize: 13,
    color: '#cc0000',
    marginTop: 4
  },
  suffix: {
    position: 'absolute',
    right: 0,
  },
  prefixText: {
    fontSize: 15,
    fontFamily: font.secondary,
    color: 'black',
    marginRight: 7
  },
  suffixText: {
    fontSize: 15,
    fontFamily: font.secondary,
    color: 'black',
    marginLeft: 7
  }
})

export const SubForm = React.forwardRef((props, ref) => {
  const { flex, dropdown, onDropdownPress, suffix, prefix } = props
  return (
    <View style={{ marginBottom: 20, flexDirection: 'row' }}>
      <Text style={{...styles3.label,  ...props.error && {
        color: '#cc0000'
      }}}>
        {props.label}
      </Text>
      <View style={{ justifyContent: 'center', flex: 1}}>
        <View>
          {dropdown ?
            <>
              <TouchableOpacity onPress={onDropdownPress}>
                <TextInput1
                  {...props}
                  style={{
                    ...styles3.textInput, ...props.error && {
                      borderBottomColor: '#cc0000',
                      borderBottomWidth: 1
                    },
                  }}
                />
                {dropdown && <Icon name='menu-down' size={20} style={styles3.suffix} />}
              </TouchableOpacity>
            </>
            :
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                  prefix && (
                    <Text style={{
                      ...styles3.prefixText, ...props.error && {
                        color: '#cc0000',
                      }
                    }}>
                      {prefix}
                    </Text>
                  )
                }
                <TextInput1
                  {...props}
                  style={{
                    ...styles3.textInput, ...props.error && {
                      borderBottomColor: '#cc0000',
                      borderBottomWidth: 1
                    },
                    flex: 1
                  }}
                />
                {
                  suffix && (
                    <Text style={{
                      ...styles3.suffixText, ...props.error && {
                        color: '#cc0000',
                      }
                    }}>
                      {suffix}
                    </Text>
                  )
                }
              </View>
            </>
          }
        </View>
        {
          props.error ? (
            <View>
              <Text style={styles3.textError}>{props.error}</Text>
            </View>
          ) : null
        }
      </View>
    </View>
  )
})

const styles3 = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: font.secondary,
    color: 'black',
    flex: .4,
    marginRight: 15
  },
  textInput: {
    borderBottomColor: 'darkgrey',
    borderBottomWidth: .6,
    fontSize: 13,
    fontFamily: font.secondary,
    paddingTop: 0,
    paddingBottom: 3,
    paddingLeft: 0,
    color: 'black'
  },
  textError: {
    fontFamily: font.secondary,
    fontSize: 12,
    color: '#cc0000',
    marginTop: 4
  },
  suffix: {
    position: 'absolute',
    right: 0,
  },
  prefixText: {
    fontSize: 13,
    fontFamily: font.secondary,
    color: 'black',
    marginRight: 7
  },
  suffixText: {
    fontSize: 13,
    fontFamily: font.secondary,
    color: 'black',
    marginLeft: 7
  }
})
