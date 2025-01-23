<template>
  <div>
    <h1>Naplózás</h1>
    <p>User ID: {{ userId }}</p>
    <label for="date">Dátum:</label>
    <input type="date" v-model="date" />

    <h3>Hallgatott rádiók</h3>
    <div v-for="radio in radios" :key="radio">
      <input type="checkbox" :value="radio" v-model="selectedRadios" />
      <label>{{ radio.name }}</label>
    </div>

    <h3>Hallgatási platformok</h3>
    <div v-for="platform in platforms" :key="platform">
      <input type="checkbox" :value="platform" v-model="selectedPlatforms" />
      <label>{{ platform.name }}</label>
    </div>

    <h3>Idősávok</h3>
    <input type="text" placeholder="08:00-10:00" v-model="timeSlot" />
    <button @click="addTimeSlot">Idősáv hozzáadása</button>
    <ul>
      <li v-for="slot in timeSlots" :key="slot">{{ slot }}</li>
    </ul>

    <button @click="saveEntry">Mentés</button>
  </div>
</template>

<script>
import { saveDiaryEntry, fetchRadiosCollection, fetchPlatformsCollection } from '@/services/api'

export default {
  data() {
    return {
      userId: this.$route.params.userId,
      date: '',
      radios: [], // Alapértelmezett rádiólista
      platforms: [], // Platformok
      selectedRadios: [],
      selectedPlatforms: [],
      timeSlots: [],
      timeSlot: '',
    }
  },
  async created() {
    this.radios = await fetchRadiosCollection()
    this.platforms = await fetchPlatformsCollection()
  },
  methods: {
    addTimeSlot() {
      if (this.timeSlot) {
        this.timeSlots.push(this.timeSlot)
        this.timeSlot = ''
      }
    },
    async saveEntry() {
      const entry = {
        userId: this.userId,
        date: this.date,
        radios: this.selectedRadios,
        platforms: this.selectedPlatforms,
        timeSlots: this.timeSlots,
      }
      try {
        await saveDiaryEntry(entry)
        alert('Napló mentve!')
      } catch (error) {
        if (error.code === 'permission-denied') {
          alert('Hiba: Nincs megfelelő jogosultság!')
        } else {
          alert(`Hiba történt: ${error.message}`)
        }
      }
    },
  },
}
</script>
