import axios from 'axios'
// import qs from 'qs'

axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'

export default {
  list: function() {
    const res = axios.get('/shs-backend-role')
    return res
  },
  addRole: function(res) {
    const res2 = axios.post('/shs-backend-role', res)
    return res2
  },
  editRole: function(res) {
    const res2 = axios.put('/shs-backend-role', res)
    return res2
  },
  delete: function(id) {
    const res2 = axios.delete('/shs-backend-role/' + id)
    return res2
  },
  deletePermissionByRole: function(roleId, psId) {
    const data = { roleId, psId }
    const res2 = axios.delete('/shs-backend-role/cancel_right', { params: data })
    return res2
  },
  allotRight: function(currentRoId, pkeys) {
    // const keys = pkeys.join(',')
    const res2 = axios.put(`/shs-backend-role/allot_right/${currentRoId}`, { keys: pkeys })
    return res2
  }
}
