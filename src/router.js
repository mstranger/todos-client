import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/store"

const SignUp = () => import("@/components/auth/SignUp.vue")
const SignIn = () => import("@/components/auth/SignIn.vue")
const ProjectsIndex = () => import("@/components/projects/ProjectsIndex.vue")
const NotFoundView = () => import("@/views/general/NotFoundView.vue")

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "root",
      redirect: "/projects"
    },
    {
      path: "/projects",
      name: "projects",
      component: ProjectsIndex,
      meta: { requireAuth: true }
    },
    {
      path: "/auth/signup",
      name: "signup",
      component: SignUp,
      meta: { requireUnauth: true }
    },
    {
      path: "/auth/signin",
      name: "signin",
      component: SignIn,
      meta: { requireUnauth: true }
    },
    {
      path: "/:catchAll(.*)",
      name: "notFound",
      component: NotFoundView
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const store = useAuthStore()

  if (to.meta.requireAuth && !store.isAuthenticated) {
    next("/auth/signin")
  } else if (to.meta.requireUnauth && store.isAuthenticated) {
    next("/")
  } else {
    next()
  }
})

export default router
