import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function(catId, type) {
    let res = axios.get(`/shs-backend-attribute`, { params: { catId, type } })
    return res
  },
  add: function(data) {
    let res = axios.post(`/shs-backend-attribute`, data)
    return res
  },
  edit: function(data) {
    let res = axios.put(`/shs-backend-attribute`, data)
    return res
  },
  delete: function(id) {
    let res = axios.delete(`/shs-backend-attribute/${id}`)
    return res
  }
}
