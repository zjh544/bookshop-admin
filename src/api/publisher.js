import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function(queryInfo) {
    let res = axios.get(`/publisher/${queryInfo.currPage}/${queryInfo.pageSize}`, { params: { query: queryInfo.search } })
    return res
  },
  add: function(data) {
    let res = axios.post(`/publisher`,data)
    return res
  },
  update: function(data) {
    let res = axios.put(`/publisher`,data)
    return res
  },
  delete: function(id) {
    let res = axios.delete(`/publisher/${id}`)
    return res
  },
}