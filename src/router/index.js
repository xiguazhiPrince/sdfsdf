import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import customerList from '../components/customerList'
import customerAdd from '../components/customerAdd'
import initProject from '../components/initProject'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/customerList',
      name: 'customerList',
      component: customerList
    },
    {
      path: '/customerAdd',
      name: 'customerAdd',
      component: customerAdd
    },
    {
      path: '/initProject',
      name: 'initProjects',
      component: initProject
    }
  ]
})
