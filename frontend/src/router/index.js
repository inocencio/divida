import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Debt from "@/views/Debt.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/debt/:id',
    name: 'Debt',
    component: Debt,
  },
  {
    path: '/debt',
    name: 'New Debt',
    component: Debt,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( (to, from, next) => {
  next()
})

export default router
