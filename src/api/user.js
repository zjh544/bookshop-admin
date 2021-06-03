import axios from 'axios'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  deleteUser: function(id) {
    let res = axios.delete('/admin/' + id)
    return res
  },
  userRole: function(id) {
    let res = axios.get(`/shs-backend-manager/role/${id}`)
    return res
  },
  allotRoles: function(id, roleIds) {
    let res = axios.put(`/shs-backend-manager/allot_role/${id}`, { keys: roleIds })
    return res
  }
}
