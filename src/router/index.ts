// Composables
import { useUserStore } from '@/store/user'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Dashboard.vue'),
      },
      {
        path: 'items',
        name: 'Items',
        component: () => import(/* webpackChunkName: "items" */ '@/views/Items.vue'),
      },
      {
        path: 'requests',
        name: 'Requests',
        component: () => import(/* webpackChunkName: "users" */ '@/views/Requests.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/Users.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if ( // make sure the user is authenticated
    !userStore.accessToken &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export default router
