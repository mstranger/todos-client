import { createRouter, createWebHistory } from "vue-router"
// import { useAuthStore } from "@/store"

import SignUp from "@/components/auth/SignUp.vue"
import SignIn from "@/components/auth/SignIn.vue"
import RootView from "@/views/general/RootView.vue"
import NotFoundView from "@/views/general/NotFoundView.vue"

// TODO: lazy loading

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "root",
      component: RootView,
      alias: "/projects"
    },
    {
      path: "/auth/signup",
      name: "signup",
      component: SignUp
    },
    {
      path: "/auth/signin",
      name: "signin",
      component: SignIn
    },
    {
      path: "/:catchAll(.*)",
      name: "notFound",
      component: NotFoundView
    }
  ]
})

// TODO:271 episode, timing - 10:15

// router.beforeEach(to => {
//   const restricted = ["/projects"]
//   const authRequired = restricted.includes(to.path)
//   const store = useAuthStore()

//   if (authRequired && !store.isAuthenticted) {
//     router.push({
//       name: "root",
//       query: { redirect: to.path }
//     })
//   }
// })

export default router
