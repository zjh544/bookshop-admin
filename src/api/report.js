import axios from 'axios'
// import qs from 'qs'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  report: function(type) {
    const res = axios.get(`/shs-backend-report/${type}`)
    return res
  }
}
