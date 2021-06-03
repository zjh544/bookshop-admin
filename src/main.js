import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/iconfont/iconfont.css'
//导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//时间
import moment from 'moment'
// 富文本
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.prototype.$quill = Quill

import qs from 'qs'
Vue.prototype.$qs = qs

import axios from 'axios'
import { Message } from 'element-ui'
//配置请求的根路径
axios.defaults.baseURL = 'http://47.106.245.151:18080/bookshop'
axios.interceptors.request.use(config => {//发送请求时携带token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

let isRefreshing = true

axios.interceptors.response.use(response => {
  if (response.data.code === 40007) {
    // if (isRefreshing) {
    //   refreshTokenRequest()
    // }
    // console.log('token过期')
    // isRefreshing = false
    // const retryOriginalRequest = new Promise(resolve => {//?
    //   addSubscriber(() => {
    //     resolve(request(response.config))
    //   })
    // })
    // return retryOriginalRequest
    this.$router.push('/login')
  }
  return response
}, error => {
  console.log(error)
  console.log(error.response)
  if (error && error.response) {
    switch (error.response.status) {
      case 400: error.message = '请求错误(400)'; break
      case 401: error.message = '未授权，请重新登录(401)'; break
      case 403: error.message = '拒绝访问(403)'; break
      case 404: error.message = '请求出错(404)'; break
      case 408: error.message = '请求超时(408)'; break
      case 500: error.message = '服务器错误(500)'; break
      case 501: error.message = '服务未实现(501)'; break
      case 502: error.message = '网络错误(502)'; break
      case 503: error.message = '服务不可用(503)'; break
      case 504: error.message = '网络超时(504)'; break
      case 505: error.message = 'HTTP版本不受支持(505)'; break
      default: error.message = `连接出错(${error.response.status})!`
    }
  } else {
    error.message = '连接服务器失败！'
  }
  Message({
    'message': error.message,
    'type': 'error'
  })
  return Promise.reject(error)
})

function refreshTokenRequest() {
  const refreshToken = window.sessionStorage.getItem('refresh_token')
  const token = window.sessionStorage.getItem('token')
  const url = '/admin/token/refresh?token=' + token + '&refresh_token=' + refreshToken
  axios.get(url).then(res => {
    isRefreshing = true
    if (res.data.code === 20000) {
      window.sessionStorage.setItem('token', res.data.data.token)
      onAccessTokenFetched()
    } else {
      console.log('refreshToken过期')
      //通知服务器清除token
      axios.get('/logout?refresh_token=' + refreshToken).then(tokenRes => {
        window.sessionStorage.clear()
        router.push('/login')
      })
    }
  })
}

let subscribers = []

function onAccessTokenFetched() {
  subscribers.forEach(callback => {
    callback()
  })
  subscribers = []
}

function addSubscriber(callback) {
  console.log(callback)
  subscribers.push(callback)
}

function request(options) {
  console.log(options)
  return axios.request(options)
}

Vue.filter('dateFormat', (input, formatString = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input).format(formatString)
  })
// Vue.filter('dateFormat', function (dateStr) {
//   const date = new Date(dateStr)
//   const Y = date.getFullYear()
//   const M = ((date.getMonth() + 1) + '').padStart(2, 0)//用零补全
//   const d = (date.getDay() + '').padStart(2, 0)
//   const h = (date.getHours() + '').padStart(2, 0)
//   const mi = (date.getMinutes() + '').padStart(2, 0)
//   const s = (date.getSeconds() + '').padStart(2, 0)
//   return `${Y}-${M}-${d} ${h}:${mi}:${s}`
// })
Vue.filter('getAge',function(date){
  var birthdays = new Date(date);
      var d = new Date();
      var age =
        d.getFullYear() -
        birthdays.getFullYear() -
        (d.getMonth() < birthdays.getMonth() ||
        (d.getMonth() == birthdays.getMonth() &&
          d.getDate() < birthdays.getDate())
          ? 1
          : 0);
      return age;
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
