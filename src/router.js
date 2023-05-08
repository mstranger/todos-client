import { createRouter, createWebHistory } from 'vue-router'

import SignUp from '@/components/auth/SignUp.vue'
import SignIn from '@/components/auth/SignIn.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/auth/signin',
      name: 'signin',
      component: SignIn
    }
  ]
})
