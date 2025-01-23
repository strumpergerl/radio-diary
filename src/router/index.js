import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomePage from '../pages/HomePage.vue'
import DiaryPage from '../pages/DiaryPage.vue'
import AdminPage from '../pages/AdminPage.vue'

const routes = [
  { path: '/:userId/:region', name: 'Home', component: HomePage },
  {
    path: '/diary/:userId/:region', // "/diary" statikus, utána dinamikus paraméterek
    name: 'DiaryPage',
    component: DiaryPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    // meta: { requiresAuth: true }, // Auth ellenőrzés szükséges
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const userId = to.params.userId
  const region = to.params.region
  if (userId) {
    console.log('User ID:', userId)
  }
  if (region) {
    console.log('Region:', region)
  }
  next()
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next() // Ha van user, folytathatja
      } else {
        next('/') // Ha nincs, visszairányítjuk a főoldalra
      }
    })
  } else {
    next() // Nem védett útvonal esetén tovább engedjük
  }
})

export default router
