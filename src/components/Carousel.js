import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { color } from '../utils';

const { width, height } = Dimensions.get('window');

export const Primary = ({ data, index = 1, renderItem, paginate = false, parallax = false, ...props}) => {
  const pagination = () => {
    const entries = data.length,
      activeIndex = index
    
    return (
      <Pagination
        dotsLength={entries}
        activeDotIndex={activeIndex}
        containerStyle={{
          marginTop: -25,
        }}
        dotStyle={styles.activeDot}
        dotColor={color.primary}
        inactiveDotColor={color.black}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6} 
      />
    )
  }
  return (
    <>
      <Carousel
        layout={"default"}
        data={data}
        sliderWidth={width}
        itemWidth={width - 60}
        renderItem={renderItem}
        hasParallaxImages={parallax ? true :false}
        {...props} 
      />
      {paginate ? pagination() : null}
    </>
  )
}

const styles = StyleSheet.create({
  activeDot:{
    width: width * 0.024,
    height: height * 0.0146,
    borderRadius: 5,
  },

})
