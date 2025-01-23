<template>
  <div class="admin-page">
    <h1>Admin Felület</h1>
    <div class="managers">
      <div>
        <h2>Rádiók Kezelése</h2>
        <RadioManager />
      </div>
      <div>
        <h2>Platformok Kezelése</h2>
        <PlatformManager />
      </div>
    </div>
  </div>
</template>

<script>
import RadioManager from '../components/admin/RadioManager.vue'
import PlatformManager from '../components/admin/PlatformManager.vue'

export default {
  name: 'AdminPage',
  components: {
    RadioManager,
    PlatformManager,
  },
}
</script>

<style scoped>
.managers {
  display: flex;
  gap: 20px;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
