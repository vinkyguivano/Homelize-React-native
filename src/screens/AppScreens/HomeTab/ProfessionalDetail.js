import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import * as Container from '../../../components/Container'
import * as Modal from '../../../components/Modal'
import * as Card from '../../../components/Card'
import { Main as Text } from '../../../components/Text'
import Loading from '../../../components/Loading'
import AuthContext from '../../../context/AuthContext'
import { api, capitalize, color } from '../../../utils'
import { showMessage } from 'react-native-flash-message'
import { Portal } from 'react-native-portalize'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const { width, height } = Dimensions.get('window')

const ProfessionalDetail = ({ route, navigation }) => {
  const { user } = useContext(AuthContext)
  const [professional, setProfessional] = useState('')
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState('')
  const [error, setError] = useState('')
  const [showMore, setShowMore] = useState(null)
  const [openMore, setOpenMore] = useState(false)
  const [selectedProject, setSelectedProject] = useState('')
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(1)
  const professionalId = route.params?.id
  const projectModalRef = useRef(null)
  const reviewModalRef = useRef(null)

  const fetchProfessional = async () => {
    try {
      const { data } = await api.get(`professional/professionals/${professionalId}`, user.token)
      setProfessional(data)
    } catch (error) {
      setError(`${error}`)
    }
  }

  const fetchReview = async (refresh = false, rating) => {
    try {

      let _page = refresh ? 1 : page + 1

      const { data } = await api.get(`professional/professionals/${professionalId}/review`, user.token, {
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

    } catch (error) {
      setError(`${error}`)
    }
  }

  useEffect(() => {
    async function mount() {
      setLoading(true)
      await fetchProfessional()
      await fetchReview(true)
      setLoading(false)
    }

    mount()
  }, [])

  useEffect(() => {
    if (error) {
      showMessage({
        message: error,
        type: 'danger'
      })
    }
  }, [error])

  const onTextLayout = useCallback((e) => {
    if (showMore === null) {
      setShowMore(e.nativeEvent.lines.length > 5)
    }
  }, [])

  const onPressProject = async (id) => {
    try {
      const { data } = await api.get(`professional/projects/${id}`, user.token)
      setSelectedProject(data)
      projectModalRef.current.open()
    } catch (e) {
      setError(`${e}`)
    }
  }

  const projects = professional.projects && professional.projects.length > 0 ?
    (
      professional.projects.map((item, idx) => (
        <TouchableNativeFeedback key={idx} onPress={() => onPressProject(item.id)}>
          <View style={styles.cardContainer}>
            <Image
              source={{ uri: item.image_path }}
              style={styles.cardImage} />
            <Text numberOfLines={2} marginTop={8} textAlign={'justify'}>
              {capitalize(item.name)}
            </Text>
          </View>
        </TouchableNativeFeedback>
      ))
    ) : null

  if (loading) {
    return <Loading />
  }

  const reviewList = reviews.slice(0, 6).map((item, index) => (
    <Card.Review key={index} item={item}/>
  ))

  return (
    <Container.Main>
      <ScrollView>
        <Image
          source={{ uri: professional.cover_pic }}
          style={styles.coverPic} />
        <View style={styles.profileContainer}>
          <Container.row>
            <Image
              source={{ uri: professional.profile_pic }}
              style={styles.profilePic} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text fontSize={17} fontWeight={'bold'} marginBottom={6} numberOfLines={2}>
                {professional.name}
              </Text>
              <Container.row>
                {professional.total_rating ?
                  <>
                    <Icon name='star' size={20} color={'#ebb61b'} />
                    <Text marginLeft={6}>
                      {`${professional.total_rating} (${professional.count_rating})`}
                    </Text>
                  </> :
                  <Text fontStyle={'italic'}>No rating yet</Text>
                }
              </Container.row>
            </View>
          </Container.row>
          <View style={styles.greyLine} />
          <View>
            <Container.row marginBottom={16}>
              <Icon name='map-marker-outline' size={20} color={'black'} />
              <Text marginLeft={8} flex={0.9}>{professional.address || "-"}</Text>
            </Container.row>
            <Container.row marginBottom={16}>
              <Icon name='phone-outline' size={20} color={'black'} />
              <Text marginLeft={8} flex={0.9}>{professional.phone_number || "-"}</Text>
            </Container.row>
            <Container.row marginBottom={16}>
              <Icon name="email-outline" size={20} color={'black'} />
              <Text marginLeft={8} flex={0.9}>{professional.email || "-"}</Text>
            </Container.row>
            <Container.row marginBottom={10}>
              <Icon name="account-outline" size={20} color={'black'} />
              <Text marginLeft={8} flex={0.9}>{professional.type_name}</Text>
            </Container.row>
          </View>
        </View>
        <View style={styles.container2}>
          <Text fontSize={17} fontWeight={'bold'} marginBottom={14}>Deskripsi</Text>
          <Text numberOfLines={!openMore ? 5 : 0} textAlign={'justify'} onTextLayout={onTextLayout}>
            {professional.description}
          </Text>
          {showMore &&
            <TouchableOpacity onPress={() => setOpenMore(!openMore)}>
              <Text color={'darkgrey'} marginTop={2}>
                {openMore ? 'Lihat lebih sedikit' : 'Lihat selengkapnya'}
              </Text>
            </TouchableOpacity>
          }
          <View style={styles.greyLine} />
          <Text fontSize={17} fontWeight={'bold'}>Projek</Text>
          {
            professional.projects && professional.projects.length > 0 ?
              <View style={styles.projectContainer}>
                {projects}
              </View> :
              <Text marginTop={15}>Projek belum ditambahkan</Text>
          }
          <View style={styles.greyLine} />
          <Text fontSize={17} fontWeight={'bold'}>Review</Text>
            <View style={{marginBottom: 23}}>          
              {
                reviews && reviews.length > 0 ? 
                  <View>
                    {reviewList}
                    {
                      reviews.length > 6
                      && <TouchableOpacity onPress={() => reviewModalRef.current.open()}> 
                          <Text color={color.primary} fontWeight={'bold'} fontSize={13} marginTop={15}>
                            Lihat semua review
                          </Text>
                      </TouchableOpacity>
                    }
                  </View> :
                  <Text marginTop={15}>Belum ada review</Text>
              }
            </View>
        </View>
      </ScrollView>
      <Portal>
        <Modal.Project
          ref={projectModalRef}
          project={selectedProject} />
        <Modal.Review
          ref={reviewModalRef} 
          reviews={reviews}
          professionalId={professionalId}
          token={user.token}
          />
      </Portal>
    </Container.Main>
  )
}

export default ProfessionalDetail

const styles = StyleSheet.create({
  coverPic: {
    width: width,
    height: height * 0.2928,
    resizeMode: 'cover'
  },
  profilePic: {
    width: width * 0.1338,
    height: width * 0.1338,
    borderRadius: width * 0.1338
  },
  profileContainer: {
    marginHorizontal: width * 0.0486,
    marginTop: -(height * 0.0750),
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 8,
    marginBottom: 23
  },
  greyLine: {
    height: 1,
    backgroundColor: 'lightgrey',
    marginVertical: 17
  },
  container2: {
    marginHorizontal: width * 0.0486,
  },
  cardContainer: {
    width: '48%',
    marginTop: 16
  },
  cardImage: {
    width: '100%',
    aspectRatio: 4 / 3
  },
  projectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})
