import React, { memo } from 'react'
import { Dimensions, StyleSheet, Text, TextInput, TouchableNativeFeedback, View } from 'react-native'
import { color, font } from '../utils'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Badge } from 'react-native-elements'

export const Primary = memo(({ placeholder, onChangeText, value, onSubmit, onOpenFilter, filterCount }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableNativeFeedback onPress={onOpenFilter}>
        <View style={styles.filterButton}>
          <Icon name="filter" size={20} style={{ marginRight: 4 }} />
          <Text style={styles.filterText}>Filter</Text>
          <Badge
            value={filterCount}
            badgeStyle={{ backgroundColor: color.primary }}
            containerStyle={{
              position: 'absolute',
              top: -6,
              right: -6,
              ... !filterCount && { display: 'none' }
            }}
          />
        </View>
      </TouchableNativeFeedback>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          onSubmitEditing={onSubmit}
        />
        <Icon name="magnify" size={20} style={styles.icon} onPress={onSubmit} />
      </View>
    </View>
  )
})

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 30
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'darkgrey',
    flex: 1,
    height: 40,
    paddingHorizontal: 20,
    fontFamily: font.secondary,
  },
  icon: {
    position: 'absolute',
    right: 10,
    marginTop: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'darkgrey',
    marginRight: 20,
    width: width * 0.230,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  filterText: {
    fontFamily: font.primary,
    fontWeight: 'bold',
    fontSize: 13
  }
})
