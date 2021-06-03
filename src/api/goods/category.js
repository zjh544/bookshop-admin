import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function(page, limit, level) {
    let res = axios.get(`/category/${page}/${limit}/${level}`)
    return res
  },
  add: function(data) {
    let res = axios.post('/category', data)
    return res
  },
  edit: function(data) {
    let res = axios.put('/category', data)
    return res
  },
  delete: function(id) {
    let res = axios.delete(`/category/${id}`)
    return res
  },
  getInfo: function(id) {
    let res = axios.get(`/category/${id}`)
    return res
  }
}
