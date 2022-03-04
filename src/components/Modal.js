import React, { useState, forwardRef, useRef, useEffect } from 'react'
import { Animated, Dimensions, FlatList, Image, Keyboard, ScrollView, StyleSheet, TextInput, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import * as MText from '../components/Text'
import * as Card from '../components/Card'
import * as Button from '../components/Button'
import * as NotFound from '../components/NotFound'
import { api, capitalize, color, font } from '../utils';
import { Modalize } from 'react-native-modalize'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ActivityIndicator from './ActivityIndicator'
import Loading from '../components/Loading'
import { graphicDesigner, architectPNG } from '../assets'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import DocumentPicker from 'react-native-document-picker'

const { width, height } = Dimensions.get('window');

export function Design({ isVisible, toggleModal, designs, rooms, budgets, tempFilter, selectedFilter, selectFilterItem, resetFilter, onSubmit }) {
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
        <View style={styles.greyBar} />
        <View style={{ paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
          <MText.Title style={styles.fontTitle}>
            Filter
          </MText.Title>
          <MText.Title
            style={{
              ...styles.fontTitle,
              opacity: 0,
              color: color.primary,
              ...(budget || room || style) && { opacity: 1 }
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
                Ruangan
              </MText.Title>
              <View style={styles.listContainer}>
                {rooms.map((i) => (
                  <Card.FilterItem
                    item={i}
                    key={i.id}
                    onPress={() => selectFilterItem(i.id, 'room')}
                    selectedItem={room === i.id} />
                ))}
              </View>
            </View>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Tipe Desain
              </MText.Title>
              <View style={styles.listContainer}>
                {designs.map((i) => (
                  <Card.FilterItem
                    item={i}
                    key={i.id}
                    onPress={() => selectFilterItem(i.id, 'style')}
                    selectedItem={style === i.id} />
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
                    selectedItem={budget === i.id} />
                ))}
              </View>
            </View>
            <View style={{ marginBottom: 60 }} />
          </View>
        </ScrollView>
        <View style={[styles.buttonContainer,
        (JSON.stringify(tempFilter) !== JSON.stringify(selectedFilter)) && { display: 'flex', opacity: 1 }]}>
          <Button.PrimaryButton
            title={"Terapkan"}
            onPress={onSubmit} />
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
  fontTitle: {
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

export const Professional = ({ isVisible, toggleModal, filter, tempFilter, selectedFilter, selectFilterItem, resetFilter, onSubmit }) => {
  const { sorts, types, cities } = filter;
  const { sort, type, city } = tempFilter;
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
      }}>
      <View style={styles.container}>
        <View style={styles.greyBar} />
        <View style={{ paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
          <MText.Title style={styles.fontTitle}>
            Filter
          </MText.Title>
          <MText.Title
            style={{
              ...styles.fontTitle,
              opacity: 0,
              color: color.primary,
              ...(sort !== '' || type || city) && { opacity: 1 }
            }}
            onPress={resetFilter}>
            Reset
          </MText.Title>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          nestedScrollEnabled>
          <View flex={1} onStartShouldSetResponder={() => true}>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Urutkan
              </MText.Title>
              <View style={styles.listContainer}>
                {sorts.map((i) => (
                  <Card.FilterItem
                    item={i}
                    key={i.id}
                    onPress={() => selectFilterItem(i.id, 'sort')}
                    selectedItem={sort === i.id} />
                ))}
              </View>
            </View>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Tipe
              </MText.Title>
              <View style={styles.listContainer}>
                {types.map((i) => (
                  <Card.FilterItem
                    item={i}
                    key={i.id}
                    onPress={() => selectFilterItem(i.id, 'type')}
                    selectedItem={type === i.id} />
                ))}
              </View>
            </View>
            <View style={styles.titleContainer}>
              <MText.Title style={styles.fontTitle}>
                Kota
              </MText.Title>
              <View style={styles.listContainer}>
                <FlatList
                  style={{ height: height * 0.2928 }}
                  data={cities}
                  renderItem={({ item }) => (
                    <Card.CityItem
                      item={item}
                      onPress={() => selectFilterItem(item.id, 'city')}
                      selectedItem={city === item.id} />
                  )}
                  keyExtractor={(item) => item.id}
                  nestedScrollEnabled
                />
              </View>
            </View>
            <View style={{ marginBottom: 60 }} />
          </View>
        </ScrollView>
        <View style={[styles.buttonContainer,
        (JSON.stringify(tempFilter) !== JSON.stringify(selectedFilter)) && { display: 'flex', opacity: 1 }]}>
          <Button.PrimaryButton
            title={"Terapkan"}
            onPress={onSubmit} />
        </View>
      </View>
    </Modal>
  )
}

export const Project = forwardRef((props, ref) => {
  const contentRef = useRef(null)
  const { project } = props
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.getScrollResponder().scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  const renderFloatingComponent = () => (
    <AnimatedTouchableOpacity
      style={[
        styles2.float,
        {
          opacity: scrollY.interpolate({
            inputRange: [400, 500],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [400, 550],
                outputRange: [0.6, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
      onPress={handleScrollToTop}
      activeOpacity={0.75}
    >
      <MText.Main color={"white"}>Top</MText.Main>
    </AnimatedTouchableOpacity>
  );

  const images = project ? project.images.map((item, index) => (
    <View key={index} style={styles2.itemContainer}>
      <Image source={{ uri: item.image_path }} style={styles2.image} />
      <MText.Main marginBottom={5}>Jenis : {item.room.name}</MText.Main>
      <MText.Main marginBottom={5}>Tipe : {item.style.name}</MText.Main>
      <MText.Main numberOfLines={0} textAlign={'justify'}>{item.description}</MText.Main>
    </View>
  )) : null

  return (
    <Modalize
      ref={ref}
      contentRef={contentRef}
      FloatingComponent={renderFloatingComponent}
      handlePosition='inside'
      handleStyle={{ backgroundColor: 'darkgrey' }}
      snapPoint={height * 0.5124}
      HeaderComponent={<View style={{ height: 35 }} />}
      scrollViewProps={{
        onScroll: Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        }),
      }}>
      <View style={styles2.container}>
        <MText.Main fontSize={17} fontWeight={'bold'} marginBottom={10}>
          {capitalize(project.name)}
        </MText.Main>
        <MText.Main marginBottom={10}>
          Projek tahun : {project.year}
        </MText.Main>
        <MText.Main numberOfLines={0} textAlign={'justify'} marginBottom={20}>
          {project.description}
        </MText.Main>
        {images}
      </View>
    </Modalize>
  )
})

const styles2 = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  itemContainer: {
    marginBottom: 30
  },
  image: {
    width: '80%',
    aspectRatio: 4 / 3,
    marginBottom: 12
  },
  float: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,

    position: 'absolute',
    right: 20,
    bottom: 20,

    width: width * 0.1216,
    height: width * 0.1216,

    borderRadius: width * 0.1216,
    backgroundColor: color.primary,
  }
})

export const Review = React.forwardRef((props, ref) => {
  const contentRef = useRef(null)
  const [reviews, setReviews] = useState(props.reviews)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [rating, setRating] = useState('')
  const [loading, setLoading] = useState(false)
  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  const scrollY = useRef(new Animated.Value(0)).current;

  const fetchReview = async (refresh = false, rating) => {
    try {

      if (refresh) {
        setLoading(true)
      }

      let _page = refresh ? 1 : page + 1

      const { data } = await api.get(`professional/professionals/${props.professionalId}/review`, props.token, {
        page: _page,
        ...rating ? { rating: rating } : {}
      })

      const { data: list, last_page } = data

      let currList

      if (refresh) {
        currList = [...list]
      } else {
        currList = [...reviews, ...list]
      }

      setReviews(currList)
      setPage(_page)
      setHasMore(_page < last_page)

      if (refresh) {
        setLoading(false)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleScrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.getScrollResponder().scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  const renderFloatingComponent = () => (
    <AnimatedTouchableOpacity
      style={[
        styles2.float,
        {
          opacity: scrollY.interpolate({
            inputRange: [400, 500],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [400, 550],
                outputRange: [0.6, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
      onPress={handleScrollToTop}
      activeOpacity={0.75}
    >
      <MText.Main color={"white"}>Top</MText.Main>
    </AnimatedTouchableOpacity>
  );

  const renderHeader = () => {
    const item = [
      { id: 0, label: 'Semua' },
      { id: 1, label: '1' },
      { id: 2, label: '2' },
      { id: 3, label: '3' },
      { id: 4, label: '4' },
      { id: 5, label: '5' }
    ]
    return (
      <View style={styles3.headerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            item.map((item, idx) => (
              <TouchableNativeFeedback key={idx} onPress={async () => {
                setRating(item.id)
                await fetchReview(true, item.id)
              }}>
                <View style={{
                  ...styles3.optionContainer,
                  ...(rating == item.id) && { backgroundColor: color.primary }
                }}>
                  <Icon name="star" size={18} color={'#ebb61b'} />
                  <MText.Main marginLeft={6} {...rating == item.id && { color: 'white' }}>
                    {item.label}
                  </MText.Main>
                </View>
              </TouchableNativeFeedback>
            ))
          }
        </ScrollView>
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <Card.Review item={item} index={index} type="modal" />
    )
  }

  const renderFooter = () => {
    return (
      <View>
        {
          hasMore && <View style={{ marginVertical: 20 }}>
            <ActivityIndicator />
          </View>
        }
      </View>
    )
  }


  const renderEmpty = () => {
    return (
      !loading ?
        <NotFound.Design
          label={'Maaf, ulasan belum tersedia'}
          fontStyle={{ marginTop: 20 }}
        /> :
        <View style={{ marginTop: 30 }}>
          <Loading />
        </View>
    )
  }

  return (
    <Modalize
      ref={ref}
      contentRef={contentRef}
      handlePosition='inside'
      handleStyle={{ backgroundColor: 'darkgrey' }}
      snapPoint={height * 0.5124}
      FloatingComponent={renderFloatingComponent}
      HeaderComponent={renderHeader}
      flatListProps={{
        data: reviews,
        renderItem: renderItem,
        keyExtractor: (item, index) => index.toString(),
        onScroll: Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        }),
        scrollEventThrottle: 16,
        onEndReachedThreshold: 0.6,
        onEndReached: () => fetchReview(false, rating),
        ListFooterComponent: renderFooter,
        ListEmptyComponent: renderEmpty
      }}
    />
  )
})

const styles3 = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: 'lightgrey'
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: 'white',
    padding: 10
  }
})

export const ChooseService = ({ isModalVisible, toggleModal, navigation, professionalId }) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      style={{
        margin: 0,
        alignItems: 'center'
      }}
    >
      <View style={stylesChooseService.container}>
        <MText.Main textAlign={'center'} marginBottom={20} fontSize={16}>Mau Gunakan Jasa Apa ?</MText.Main>
        <TouchableNativeFeedback onPress={() => {
          toggleModal()
          navigation.navigate('Architecture Order', { pid: professionalId })
        }}>
          <View style={stylesChooseService.serviceContainer}>
            <Image source={architectPNG} style={stylesChooseService.image} />
            <MText.Main marginTop={10}>Arsitek</MText.Main>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => {
          toggleModal()
          navigation.navigate('Interior Design Order', { pid: professionalId })
        }}>
          <View style={stylesChooseService.serviceContainer}>
            <Image source={graphicDesigner} style={stylesChooseService.image} />
            <MText.Main marginTop={10}>Desainer Interior</MText.Main>
          </View>
        </TouchableNativeFeedback>
      </View>
    </Modal>
  )
}

const stylesChooseService = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: width * 0.7785
  },
  serviceContainer: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 11,
    marginBottom: 15,
    padding: 16,
    alignItems: 'center',
    width: width * 0.4379
  },
  image: {
    width: width * 0.2676,
    height: 'auto',
    aspectRatio: 4 / 3,
    resizeMode: 'contain',
  }
})

export const Primary = ({ isVisible, toggleModal, designList, selectedDesign, onChange, onBlur, label }) => {
  const [style, setStyle] = useState(selectedDesign)

  useEffect(() => {
    if (isVisible) {
      setStyle(selectedDesign)
    }
  }, [isVisible])

  const handleClose = () => {
    onBlur()
    toggleModal()
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableNativeFeedback onPress={() => setStyle(item)}>
        <View style={selectDesignStyles.itemContainer}>
          <MText.Main fontSize={15}>{item.name}</MText.Main>
          {
            style.id === item.id ?
              <Icon name="checkbox-marked-circle" size={25} color={color.primary} />
              :
              <Icon name="checkbox-blank-circle-outline" size={25} color={'darkgrey'} />
          }
        </View>
      </TouchableNativeFeedback>
    )
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      style={{
        margin: 0
      }}>
      <View style={selectDesignStyles.container}>
        <View style={selectDesignStyles.headerWrapper}>
          <MText.Main fontSize={16} fontWeight={'bold'}>{label}</MText.Main>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={25} color={'black'} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={designList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={{
            height: height * 0.366,
          }}
          contentContainerStyle={{
            paddingBottom: height * 0.085
          }}
        />
        {
          (style && style.id != selectedDesign.id) ?
            <View style={selectDesignStyles.buttonContainer}>
              <Button.PrimaryButton
                title={`Pilih ${style.name}`}
                onPress={() => {
                  toggleModal()
                  onChange(style)
                }}
                fontStyle={{
                  fontSize: 15
                }} />
            </View>
            : null
        }
      </View>
    </Modal>
  )
}

const selectDesignStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginTop: 'auto',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 15
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'darkgrey',
    borderBottomWidth: .5,
    paddingBottom: 10,
    marginBottom: 10
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
  }
})

export const AddPhoto = ({ isModalVisible, toggleModal, onAddPhoto }) => {
  const [description, setDescription] = useState(null)
  const [photo, setPhoto] = useState(null)

  const handleClose = () => {
    setDescription(null)
    setPhoto(null)
    toggleModal()
  }

  const handleChoosePhoto = () => {
    launchImageLibrary({
      quality: 1,
      mediaType: 'photo'
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        setPhoto(response.assets[0])
      }
    })
  }

  const addPhoto = async () => {
    onAddPhoto({ photo, description })
    toggleModal()
    setPhoto(null)
    setDescription(null)
  }

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      style={{
        margin: 0,
        alignItems: 'center'
      }}>
      <View style={addPhotoStyles.container}>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={handleClose}>
            <Icon name='close' size={24} color={'black'} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
        {
          photo && (
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={{ uri: photo.uri }}
                style={{
                  width: 200,
                  height: 200,
                }} />
            </View>
          )
        }
        <TouchableNativeFeedback onPress={handleChoosePhoto}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <Icon name='plus' size={23} color={'black'} />
            <MText.Main fontSize={14}>{photo ? 'Ubah' : 'Pilih'} Foto</MText.Main>
          </View>
        </TouchableNativeFeedback>
        <TextInput
          multiline
          placeholder='Masukkan deskripsi...'
          style={addPhotoStyles.textInputContainer}
          onChangeText={setDescription}
          value={description} />
        <Button.PrimaryButton
          isDisabled={!photo || !description ? true : false}
          onPress={addPhoto}
          marginTop={15}
          width={120}
          height={35}
          title={"Submit"}
          fontStyle={{
            fontSize: 13
          }} />
      </View>
    </Modal>
  )
}

const addPhotoStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: width * (320 / width),
    padding: 15
  },
  textInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'darkgrey',
    padding: 0,
    fontSize: 14,
    fontFamily: font.secondary
  }
})

export const Loading1 = ({ isVisible }) => {
  return(
    <Modal
      isVisible={isVisible}
      style={{margin: 0}}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator />
        </View>
    </Modal>
  )
}

export const SelectGalleryOrCamera = ({ isVisible, toggleModal, selectImage }) => {
  const options = {
    mediaType: 'photo',
    quality: 1,
  }
  const handleLaunchCamera = async () => {
    launchCamera(options , (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        selectImage(response.assets[0])
        toggleModal()
      }
    })
  }

  const handleLauchGallery = () => {
    launchImageLibrary(options , (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        selectImage(response.assets[0])
        toggleModal()
      }
    })
  }

  return(
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      style={{
        margin: 0,
        alignItems: 'center'
      }}>
        <View style={styleSelectGalleryorCamera.container}>
          <TouchableOpacity activeOpacity={1} onPress={handleLaunchCamera}>
            <View style={styleSelectGalleryorCamera.itemWrapper}>
              <Icon name='camera' size={23} style={{marginRight: 7}}/>
              <MText.Main>Ambil Foto</MText.Main>
            </View>
          </TouchableOpacity>
          <View style={{height: 1, backgroundColor: 'lightgrey'}}/>
          <TouchableOpacity activeOpacity={1} onPress={handleLauchGallery}>
            <View style={styleSelectGalleryorCamera.itemWrapper}>
              <Icon name='image-size-select-actual' size={23} style={{marginRight: 7}}/>
              <MText.Main>Pilih dari Galeri</MText.Main>
            </View>
          </TouchableOpacity>
        </View>
    </Modal>
  )
}

const styleSelectGalleryorCamera = StyleSheet.create({
  container: {
    width: width * ( 250 / width ),
    backgroundColor: 'white',
    padding: 9
  },
  itemWrapper: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export const Secondary = ({isVisible, toggleModal, label, optionList, selectedOption, onChange}) => {
  
  const onRenderItem = ({item, index}) => {
    return(
      <TouchableNativeFeedback onPress={() => onChange(item.id)}>
        <View style={styleSecondary.itemContainer}>
          <MText.Main flex={1}>{item.name}</MText.Main>
          {
            item.id === selectedOption && (
              <Icon name="checkbox-marked-circle" size={20} color={color.primary}/>
            )
          }
        </View>
      </TouchableNativeFeedback>
    )
  }
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal}
      onBackButtonPress={toggleModal}
      style={{
        margin: 0
      }}>
        <View style={styleSecondary.container}>
          <View style={selectDesignStyles.headerWrapper}>
            <MText.Main fontSize={16} fontWeight={'bold'}>{label}</MText.Main>
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="close" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={optionList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={onRenderItem}
            style={{
              maxHeight: 300,
              minHeight: 150
            }} 
            />
        </View>
    </Modal>
  )
}

export const Form = ({isVisible, toggleModal, label, optionList, selectedOption, onChange, onBlur}) => {
  
  const onRenderItem = ({item, index}) => {
    return(
      <TouchableNativeFeedback onPress={() => { onChange(item); toggleModal() }}>
        <View style={styleSecondary.itemContainer}>
          <MText.Main flex={1}>{item.name}</MText.Main>
          {
            item.id === selectedOption.id && (
              <Icon name="checkbox-marked-circle" size={20} color={color.primary}/>
            )
          }
        </View>
      </TouchableNativeFeedback>
    )
  }

  const onClose = () => {
    onBlur()
    toggleModal()
  }
  
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={{
        margin: 0
      }}>
        <View style={styleSecondary.container}>
          <View style={selectDesignStyles.headerWrapper}>
            <MText.Main fontSize={16} fontWeight={'bold'}>{label}</MText.Main>
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="close" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={optionList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={onRenderItem}
            style={{
              maxHeight: 300,
              minHeight: 150
            }} 
            />
        </View>
    </Modal>
  )
}

const styleSecondary = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 'auto',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 15
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'darkgrey',
    borderBottomWidth: .5,
    paddingBottom: 10,
    marginBottom: 10
  }
})

export const OrderDetail = ({ isVisible, toggleModal, renderContent}) => {
  return (
    <Modal
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      isVisible={isVisible}>
        <View style={styleOrderDetail.container}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15}}>
            <MText.Main fontWeight={'bold'}>Detail Order</MText.Main>
            <TouchableOpacity onPress={toggleModal}>
              <Icon name="close" size={22}/>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={{padding: 15, paddingTop: 0}}>
              {renderContent}
            </View>
          </ScrollView>
        </View>
    </Modal>
  )
}

const styleOrderDetail = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: height * (600 / height),
    borderRadius: 8
  }
})

export const UpdateProgress = ({ isVisible, toggleModal, onSubmit }) => {
  const [ title, setTitle ] = useState('')
  const [ file, setFile ] = useState('')
  const ref = useRef(null)

  const onUploadPress = () => {
    DocumentPicker.pick({
      type: DocumentPicker.types.allFiles
    })
    .then((res) => {
      console.log(res)
      setFile(res[0])    
    }, (err) => {
      if(DocumentPicker.isCancel(err)){
        console.log('document pick cancelled')
      }else{
        console.log('error ' + err)
      }
    })
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleModal}
      onBackdropPress={() => {
        if(ref.current?.isFocused()){
          Keyboard.dismiss()
        }else{
          toggleModal()
        }
      }}
      style={{ margin: 0, alignItems: 'center'}}>
        <View style={styleUpdateProgress.container}>
          <View style={{ alignItems: 'center'}}>
            <MText.Main fontSize={15} fontWeight={'bold'}>Update Progress</MText.Main>
          </View>
          <View>
            <TextInput 
              ref={ref}
              placeholder='Masukkan status...'
              style={styleUpdateProgress.textInput}
              value={title}
              onChangeText={setTitle}/>
            <MText.Main color={color.red}>required</MText.Main>
            <TouchableNativeFeedback onPress={onUploadPress}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: 18,
                borderBottomColor: 'darkgrey',
                borderBottomWidth: 1,
                paddingBottom: 5}}>
                <MText.Main numberOfLines={1} flex={1}>{!file ? 'Upload File' : file.name }</MText.Main>
                <Icon name="plus" size={24}/>
              </View>
            </TouchableNativeFeedback>
            {
              file ? (
                <TouchableNativeFeedback onPress={() => setFile('')}>
                  <View>
                    <MText.Main fontSize={12} color={color.red}>Hapus file</MText.Main>
                  </View>
                </TouchableNativeFeedback>
              ) : null
            }
            <Button.PrimaryButton 
              title={'Submit'}
              onPress={() => {
                setTitle('')
                setFile('')
                onSubmit(title, file )
              }}
              height={32}
              marginTop={18}
              isDisabled={ !title }
              fontStyle={{
                fontSize: 14
              }}/>
          </View>
        </View>
    </Modal>
  )
}

const styleUpdateProgress = StyleSheet.create({
  container : {
    backgroundColor: 'white',
    width: 320,
    padding: 14
  },
  textInput: {
    borderBottomColor: 'darkgrey',
    borderBottomWidth: 1,
    padding: 0,
    fontSize: 14,
    fontFamily: font.secondary,
    marginTop: 18
  }
})

export const FinishOrder = ({ isVisible, toggleModal, onSubmit}) => {
  const [ title, setTitle ] = useState('')
  const ref = useRef(null)
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleModal}
      onBackdropPress={() => {
        if(ref.current?.isFocused()){
          Keyboard.dismiss()
        }else{
          toggleModal()
        }
      }}
      style={{ margin: 0, alignItems: 'center'}}>
        <View style={styleUpdateProgress.container}>
          <View style={{ alignItems: 'center'}}>
            <MText.Main fontSize={15} fontWeight={'bold'}>Order Selesai</MText.Main>
          </View>
          <View>
            <MText.Main marginTop={11}>Masukkan link penyimpanan hasil akhir pekerjaan anda</MText.Main>
            <TextInput
              ref={ref}
              placeholder='Masukkan link...'
              style={{...styleUpdateProgress.textInput, marginTop: 11}}
              value={title}
              onChangeText={setTitle}/>
            <Button.PrimaryButton 
              title={'Submit'}
              onPress={() => {
                setTitle('')
                onSubmit(title)
              }}
              height={32}
              marginTop={18}
              isDisabled={ !title }
              fontStyle={{
                fontSize: 14
              }}/>
          </View>
        </View>
    </Modal>
  )
}

export const Complaint = ({ isVisible, toggleModal, onSubmit}) => {
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [photo, setPhoto] = useState(null)
  let titleRef, descRef

  const handleClose = () => {
    setTitle(null)
    setDescription(null)
    setPhoto(null)
    toggleModal()
  }

  const handleChoosePhoto = () => {
    launchImageLibrary({
      quality: 1,
      mediaType: 'photo'
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        setPhoto(response.assets[0])
      }
    })
  }

  const addPhoto = async () => {
    setTitle(null)
    setDescription(null)
    setPhoto(null)
    onSubmit(title, description, photo)
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={() => {
        if(titleRef?.isFocused() || descRef?.isFocused()){
          Keyboard.dismiss()
        }else{
          handleClose()
        }
      }}
      style={{ margin: 0, alignItems: 'center'}}>
      <View style={complaintStyles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
          <MText.Main fontWeight={'bold'} fontSize={15}>Ajukan Komplain</MText.Main>
          <TouchableOpacity onPress={handleClose}>
            <Icon name='close' size={22} color={'black'}/>
          </TouchableOpacity>
        </View>
        <TextInput
          ref={(ref) => titleRef = ref}
          placeholder='Masukkan judul komplain'
          style={complaintStyles.textInputContainer}
          onChangeText={setTitle}
          value={title} />
        <TextInput
          multiline
          ref={(ref) => descRef = ref}
          placeholder='Masukkan deskripsi komplain'
          style={complaintStyles.textInputContainer}
          onChangeText={setDescription}
          value={description} />
        <TouchableNativeFeedback onPress={handleChoosePhoto}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
            <Icon name='plus' size={23} color={'black'} />
            <MText.Main fontSize={14}>{photo ? 'Ubah' : 'Upload'} bukti foto</MText.Main>
          </View>
        </TouchableNativeFeedback>
        {
          photo && (
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={{ uri: photo.uri }}
                style={{
                  width: 200,
                  height: 200,
                }} />
            </View>
          )
        }
        <View style={{alignItems: 'center'}}>
          <Button.PrimaryButton
            isDisabled={!photo || !description || !title ? true : false}
            onPress={addPhoto}
            marginTop={15}
            width={120}
            height={35}
            title={"Submit"}
            fontStyle={{
              fontSize: 13
            }} />
        </View>
      </View>
    </Modal>
  )
}

const complaintStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: width * 0.8516,
    padding: 15
  },
  textInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'darkgrey',
    padding: 0,
    fontSize: 14,
    fontFamily: font.secondary,
    marginTop: 15
  }
})

export const ComplaintDetail = ({ isVisible, toggleModal, content, navigation, profName }) => {
  
  const handleOpenImageDetail = (uri) => {
    toggleModal()
    navigation.navigate("Photo", {
      from: "Order Detail",
      data: { uri }
    })
  }
  
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      style={{margin: 30}}>
        <View style={complaintDetailStyles.container}>
          <ScrollView>
            <TouchableOpacity onPress={toggleModal}>
              <Icon name='close' size={23} color={'black'} style={{marginLeft: 'auto', marginBottom: 10}}/>
            </TouchableOpacity>
            <MText.Main textAlign={'center'}>{content.title}</MText.Main>
            <MText.Main marginTop={10}>Deskripsi : {content.description}</MText.Main>
            <TouchableOpacity
              onPress={() => handleOpenImageDetail(content.request_image_path)}>  
              <Image 
                source={{uri: content.request_image_path}}
                style={complaintDetailStyles.image}/>
            </TouchableOpacity>
            <View style={{backgroundColor: 'lightgrey', height: 1, marginVertical: 5}}/>
            {
              content.response && (
                <View style={{marginTop: 20}}>
                  <MText.Main textAlign={'center'} fontWeight={'bold'} marginBottom={10}>{profName}</MText.Main>
                  <MText.Main>Jawaban: {content.response}</MText.Main>
                  {
                    content.response_image_path && (
                      <TouchableOpacity
                        onPress={handleOpenImageDetail(content.response_image_path)}>
                        <Image 
                          source={{ uri: content.response_image_path}}
                          style={complaintDetailStyles.image}/>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )
            }
          </ScrollView>
        </View>    
    </Modal>
  )
}

const complaintDetailStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12
  },
  image: {
    height: 180,
    width: 240,
    marginVertical: 8,
    alignSelf: 'center'
  }
})

export const RejectComplaint = ({ isVisible, toggleModal, onSubmit}) => {
  const [description, setDescription] = useState(null)
  const [photo, setPhoto] = useState(null)
  let descRef

  const handleClose = () => {
    setDescription(null)
    setPhoto(null)
    toggleModal()
  }

  const handleChoosePhoto = () => {
    launchImageLibrary({
      quality: 1,
      mediaType: 'photo'
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        console.log('Error ' + response.errorCode)
      } else {
        setPhoto(response.assets[0])
      }
    })
  }

  const addPhoto = async () => {
    setDescription(null)
    setPhoto(null)
    onSubmit(description, photo)
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={() => {
        if(descRef?.isFocused()){
          Keyboard.dismiss()
        }else{
          handleClose()
        }
      }}
      style={{ margin: 0, alignItems: 'center'}}>
      <View style={complaintStyles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
          <MText.Main fontWeight={'bold'} fontSize={15}>Tolak Komplain</MText.Main>
          <TouchableOpacity onPress={handleClose}>
            <Icon name='close' size={22} color={'black'}/>
          </TouchableOpacity>
        </View>
        <TextInput
          multiline
          ref={(ref) => descRef = ref}
          placeholder='Masukkan alasan penolakan'
          style={complaintStyles.textInputContainer}
          onChangeText={setDescription}
          value={description} />
        <TouchableNativeFeedback onPress={handleChoosePhoto}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
            <Icon name='plus' size={23} color={'black'} />
            <MText.Main fontSize={14}>{photo ? 'Ubah' : 'Upload'} gambar pendukung (tidak wajib)</MText.Main>
          </View>
        </TouchableNativeFeedback>
        {
          photo && (
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image
                source={{ uri: photo.uri }}
                style={{
                  width: 200,
                  height: 200,
                }} />
            </View>
          )
        }
        <View style={{alignItems: 'center'}}>
          <Button.PrimaryButton
            isDisabled={!description ? true : false}
            onPress={addPhoto}
            marginTop={15}
            width={120}
            height={35}
            title={"Submit"}
            fontStyle={{
              fontSize: 13
            }} />
        </View>
      </View>
    </Modal>
  )
}