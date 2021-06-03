import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function(queryInfo) {
    let res = axios.get(`/goods/${queryInfo.currPage}/${queryInfo.pageSize}`, { params: { query: queryInfo.search } })
    return res
  },
  add: function(data) {
    let res = axios.post(`/goods`, data)
    return res
  },
  edit: function(goodsId,goodsDetailId,data) {
    let res = axios.put(`/goods/${goodsId}/${goodsDetailId}`, data)
    return res
  },
  delete: function(id) {
    let res = axios.delete(`/goods/${id}`)
    return res
  },
  checkName: function(name) {
    let res = axios.get(`/goods/checkName`, { params: { name } })
    return res
  }
}
