import { from } from 'core-js/fn/array'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Router from 'vue-router'

const Login = () => import('./components/Login.vue')
const Home = () => import('./components/Home.vue')
const Welcome = () => import('./components/Welcome.vue')

const Admin = () => import('./components/user/Admin.vue')
const Rights = () => import('./components/power/Rights.vue')
const Roles = () => import('./components/power/Roles.vue')
const User = () => import('./components/user/User.vue')

const Category = () => import('./components/goods/Category.vue')
const Params = () => import('./components/goods/Params.vue')
const GoodsList = () => import('./components/goods/Goods.vue')
const GoodsAdd = () => import('./components/goods/Add.vue')

const Orders = () => import('./components/Orders.vue')
const Report = () => import('./components/report/Report.vue')

const Slider = () => import('./components/Slider.vue')
const Publisher = () => import('./components/Publisher.vue')
const Express = () => import('./components/Express.vue')

Vue.use(Router)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/admin', component: Admin },
      { path: '/user', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Category },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report },
      { path: '/slider', component: Slider },
      { path: '/publisher', component: Publisher },
      { path: '/express', component: Express },
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //to：将要访问的路径
  //from：从哪个路径跳转而来
  //next：是一个函数，表示放行
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('login')//强制跳转
  next()//放行
})

export default router
