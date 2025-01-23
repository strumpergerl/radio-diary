<script>
// import { RouterLink, RouterView } from 'vue-router'
// import DiaryEntry from './views/DiaryEntry.vue'

import { useRoute } from 'vue-router'
import { useUserStore } from './stores/userStore' // Pinia Store
import { watchEffect } from 'vue'

export default {
  name: 'DiaryPage',
  setup() {
    const route = useRoute()
    const userStore = useUserStore()

    // URL paraméterek beállítása
    userStore.setUser({
      userId: route.params.userId,
      region: route.params.region,
    })
    watchEffect(() => {
      const { userId, region } = route.params
      userStore.setUser({ userId, region })
    })

    return {
      userId: userStore.userId,
      region: userStore.region,
    }
  },
}
</script>

<template>
  <header>
    <div class="wrapper">
      <RouterView />
    </div>
  </header>
</template>

<style scoped></style>
