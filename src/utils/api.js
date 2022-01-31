import axios from "axios";

const api = {
  get: (url, token = "", params = {}) => {
    return axios.get(`http://prod.eba-dcjmmfsy.ap-southeast-1.elasticbeanstalk.com/api/${url}`, {
      params: {
        ...params
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization' : `Bearer ${token}` } : {})
      }
    })
  },

  post:  (url, token = "", body , params = {}, headers = {}) => {
    return axios.post(`http://prod.eba-dcjmmfsy.ap-southeast-1.elasticbeanstalk.com/api/${url}`, body, {
      params: {
        ...params
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization' : `Bearer ${token}` } : {}),
        ...headers
      }
    })
  },

  put: (url, token = "", body , params = {}, headers = {}) => {
    return axios.put(`http://prod.eba-dcjmmfsy.ap-southeast-1.elasticbeanstalk.com/api/${url}`, body, {
      params: {
        ...params
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization' : `Bearer ${token}` } : {}),
        ...headers
      }
    })
  },

  delete:  (url, token = "", params = {}) => {
    return axios.delete(`http://prod.eba-dcjmmfsy.ap-southeast-1.elasticbeanstalk.com/api/${url}`, {
      params: {
        ...params
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization' : `Bearer ${token}` } : {})
      }
    })
  }
}

export default api