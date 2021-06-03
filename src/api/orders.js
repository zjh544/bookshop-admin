import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function(queryInfo) {
    let res = axios.get(`/orders/${queryInfo.page}/${queryInfo.limit}`, { params: { query: queryInfo.search } })
    return res
  }
}
