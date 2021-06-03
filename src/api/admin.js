import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  validate: function(data) {
    let res = axios.get(`/user/validate`, { params: { username: data } })
    return res
  },
  register: function(data) {
    let res = axios.post('/user/register', data)
    return res
  },
  login: function(data) {
    let res = axios.post('/admin/login', data)
    return res
  },
  logout: function() {
    let res = axios.post('/user/logout')
    return res
  },
}
