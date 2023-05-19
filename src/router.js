import { createRouter, createWebHistory } from "vue-router"
// import { useAuthStore } from "@/store"

import SignUp from "@/components/auth/SignUp.vue"
import SignIn from "@/components/auth/SignIn.vue"
import RootView from "@/views/general/RootView.vue"

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
    }
    // {
    //   path: "/:catchAll(.*)",
    //   name: "Not Found",
    //   component: NotFoundPage
    // }
  ]
})

// TODO:272 episode, timing - 0:44

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
