import Vue from 'vue'
import VueRouter from 'vue-router'
import Mint from '../components/Mint.vue'
import Index from '../components/Index.vue'
import Profile from '../components/Profile.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Index,
  },
  {
    path: '/mint',
    name: 'Mint',
    component: Mint
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
