import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function() {
    let res = axios.get('/shs-backend-permission')
    return res
  }
}
