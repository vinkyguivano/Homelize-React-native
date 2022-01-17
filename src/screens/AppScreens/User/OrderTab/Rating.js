import React, { useEffect, useContext, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import * as Container from '../../../../components/Container'
import { Main as Text } from '../../../../components/Text'
import { Rating, RatingProps } from 'react-native-elements'
import * as Button from '../../../../components/Button'
import { TextInput } from 'react-native-gesture-handler'
import { api } from '../../../../utils'
import AuthContext from '../../../../context/AuthContext'
import { showMessage } from 'react-native-flash-message'

const OrderRating = ({ navigation, route: { params } }) => {
  const { orderId, rate, review, profile_pic, prof_name, onGoBack } = params
  const [rateNumber, setRateNumber] = useState('')
  const [reviewState, setReviewState] = useState(review)
  const { user: { token }} = useContext(AuthContext)

  const ratingCompleted = (number) => {
    setRateNumber(number)
  }

  const onSubmit = async() => {
    try {
      await api.post(`orders/${orderId}/rating`, token, {
        rating: rateNumber,
        review: reviewState
      })
      navigation.goBack()
      onGoBack()
      showMessage({
        message: 'Berhasil menambahkan rating',
        type: 'success'
      })
    } catch (error) {
      showMessage({
        message: 'error ' + error,
        type: 'danger'
      })
    }
  }

  return (
    <>
      <Container.Scroll>
        <View style={{alignItems: 'center'}}>
          <Image source={{ uri: profile_pic }} style={styles.profilePic} />
          <Text style={styles.profName}>{prof_name}</Text>
          <View style={styles.ratingContainer}>
            <Rating
              imageSize={45}
              startingValue={rate || 0}
              onFinishRating={ratingCompleted}
              readonly={rate ? true : false}
            />
          </View>
          <TextInput
            multiline
            placeholder='Masukkan review..'
            value={reviewState}
            numberOfLines={5}
            onChangeText={setReviewState}
            style={styles.textInput}
            editable={rate ? false: true}/>
          <Button.PrimaryButton 
            title={'Submit'}
            height={'auto'}
            width={270}
            padding={10}
            marginTop={17}
            isDisabled={!rateNumber}
            onPress={onSubmit}/>
        </View>
      </Container.Scroll>
    </>
  )
}

export default OrderRating

const styles = StyleSheet.create({
  profName: {
    fontSize: 17,
    marginTop: 16
  },
  ratingContainer: {
    marginVertical: 20
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    width: 270,
    padding: 10,
    textAlignVertical: 'top',
    fontSize: 15,
    color: 'black'
  }
})
