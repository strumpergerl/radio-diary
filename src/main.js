// import './assets/main.css'

// import { createApp } from 'vue'
// import { createPinia } from 'pinia'

// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

import { createApp } from 'vue'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import firebaseApp from './services/firebase' // Az általad definiált Firebase konfiguráció

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

// Telepítjük a VueFire-t és engedélyezzük a Firestore-t
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireFirestoreOptionsAPI],
})

app.use(router)
app.use(createPinia())

app.mount('#app')
