import axios from "axios";

const api = {
  get: (url, token = "", params = {}) => {
    return axios.get(`https://warm-garden-46483.herokuapp.com/api/${url}`, {
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
    return axios.post(`https://warm-garden-46483.herokuapp.com/api/${url}`, body, {
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
    return axios.put(`https://warm-garden-46483.herokuapp.com/api/${url}`, body, {
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
    return axios.delete(`https://warm-garden-46483.herokuapp.com/api/${url}`, {
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