import axios from "axios";

const api = {
  get: (url, token = "", params = {},) => {
    return axios.get(`http://127.0.0.1:8000/api/${url}`, {
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

  post:  (url, token = "", body , params = {}) => {
    return axios.post(`http://127.0.0.1:8000/api/${url}`, body, {
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