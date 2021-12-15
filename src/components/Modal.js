import React, { useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import Modal from 'react-native-modal'
import * as MText from '../components/Text'
import * as Card from '../components/Card'
import * as Button from '../components/Button'
import { color, font } from '../utils';

const { width, height} = Dimensions.get('window');

export function Design({ isVisible, toggleModal, designs, rooms, budgets, tempFilter, selectedFilter, selectFilterItem, resetFilter, onSubmit}) {
  const { budget, room, style } = tempFilter
  const [scrollOffset, setScrollOffset] = useState(null)
  const scrollViewRef = React.useRef(null)

  const handleOnScroll = event => {
     setScrollOffset(event.nativeEvent.contentOffset.y)
  };

  const handleScrollTo = p => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      onSwipeComplete={toggleModal}
      swipeDirection={'down'}
      onBackButtonPress={toggleModal}
      useNativeDriverForBackdrop={true}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      propagateSwipe={true}
      style={{
        margin: 0
      }}
    >
      <View style={styles.container}>
        <View style={styles.greyBar}/>
        <View style={{paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
          <MText.Title style={styles.fontTitle}>
            Filter
          </MText.Title>
          <MText.Title 
            style={{
              ...styles.fontTitle, 
              opacity: 0,
              color: color.primary,
              ...( budget || room || style) && { opacity: 1 } 
            }}
            onPress={resetFilter}>
            Reset
          </MText.Title>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onScroll={handleOnScroll}>
          <View flex={1} onStartShouldSetResponder={() => true}>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Jenis Desain
              </MText.Title>
              <View style={styles.listContainer}>
                {designs.map((i) => (
                  <Card.FilterItem 
                    item={i} 
                    key={i.id} 
                    onPress={() => selectFilterItem(i.id, 'style')} 
                    selectedItem={style === i.id }/>
                  ))}
              </View>
            </View>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Jenis Ruangan
              </MText.Title>
              <View style={styles.listContainer}>
                {rooms.map((i) => (
                  <Card.FilterItem 
                    item={i} 
                    key={i.id} 
                    onPress={() => selectFilterItem(i.id, 'room')} 
                    selectedItem={room === i.id}/>
                  ))}
              </View>
            </View>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Budget
              </MText.Title>
              <View style={styles.listContainer}>
                {budgets.map((i) => (
                  <Card.FilterItem 
                    item={i} 
                    key={i.id} 
                    onPress={() => selectFilterItem(i.id, 'budget')} 
                    selectedItem={budget === i.id}/>
                  ))}
              </View>
            </View>
            <View style={{marginBottom: 60}}/>
          </View>
        </ScrollView>
        <View style={[styles.buttonContainer, 
          (JSON.stringify(tempFilter) !== JSON.stringify(selectedFilter)) && { display: 'flex', opacity: 1}]}>
          <Button.PrimaryButton 
            title={"Terapkan"}
            onPress={onSubmit}/>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 'auto',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 15,
    height: '65%'
  },
  greyBar: {
    width: width * 0.150,
    height: height * 0.009,
    borderRadius: 10,
    backgroundColor: 'darkgrey',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: height * 0.0219
  },
  titleContainer: {
    paddingVertical: height * 0.0219,
    borderBottomWidth: 1,
    borderBottomColor: 'darkgrey',
  },
  fontTitle:{
    fontFamily: font.secondary, 
    fontWeight: 'bold', 
    fontSize: 15
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: width * 0.0121,
    paddingVertical: 8
  },
  buttonContainer: {
    elevation: 10,
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 10,
    opacity: 0,
    display: 'none'
  }
})
