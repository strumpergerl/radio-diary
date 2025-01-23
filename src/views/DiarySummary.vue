<template>
  <div>
    <h1>Napló Összefoglaló</h1>
    <ul>
      <li v-for="entry in diaryEntries" :key="entry.id">
        <p>Dátum: {{ entry.date }}</p>
        <p>Rádiók: {{ entry.radios.join(', ') }}</p>
        <p>Platformok: {{ entry.platforms.join(', ') }}</p>
        <p>Idősávok: {{ entry.timeSlots.join(', ') }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { fetchDiaryEntries } from '@/services/api'

export default {
  data() {
    return {
      userId: this.$route.params.userId,
      diaryEntries: [],
    }
  },
  async created() {
    this.diaryEntries = await fetchDiaryEntries(this.userId)
  },
}
</script>
