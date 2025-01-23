<template>
  <div class="home-page">
    <h1>Rádióhallgatási Napló</h1>
    <p>Válaszd ki a napot, amelyhez a naplót szeretnéd kitölteni!</p>

    <div class="date-buttons">
      <button
        v-for="(date, index) in availableDates"
        :key="date.date"
        :class="getButtonClass(date)"
        :disabled="date.disabled"
        @click="navigateToDiary(date.date)"
      >
        {{ formatDate(date.date) }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFirestore } from 'vuefire'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useUserStore } from '../stores/userStore'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()
    const db = useFirestore()
    const userStore = useUserStore()
    const userId = userStore.userId

    // Az első látogatás dátuma
    const firstVisitDate = ref(null)

    // Kitöltött dátumok az adatbázisból
    const completedDates = ref([])

    // Dátumok létrehozása
    const availableDates = computed(() => {
      if (!firstVisitDate.value) return []
      const dates = []
      const startDate = new Date(firstVisitDate.value)
      startDate.setDate(startDate.getDate() - 1) // Tegnap
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        dates.push({
          date: date.toISOString().split('T')[0],
          completed: completedDates.value.includes(date.toISOString().split('T')[0]),
          disabled: i > 0 && !completedDates.value.includes(date.toISOString().split('T')[0]),
        })
      }
      return dates
    })

    // Adatok betöltése a `userDiaries` gyűjteményből
    const loadUserData = async () => {
      const userDocRef = doc(db, 'userDiaries', userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        firstVisitDate.value = userData.firstVisitDate
          ? new Date(userData.firstVisitDate)
          : new Date()
        completedDates.value = userData.completedDates || []
      } else {
        // Ha új felhasználó
        firstVisitDate.value = new Date()
        await setDoc(userDocRef, {
          firstVisitDate: firstVisitDate.value.toISOString().split('T')[0],
          completedDates: [],
        })
      }
    }

    // Gomb osztálya
    const getButtonClass = (date) => {
      if (date.completed) return 'completed'
      if (!date.disabled) return 'available'
      return 'disabled'
    }

    // Formázott dátum megjelenítése
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('hu-HU', options)
    }

    // Navigáció a DiaryPage-re
    const navigateToDiary = (date) => {
      router.push(`/diary/${userId}/${userStore.region}?date=${date}`)
    }

    // Betöltés indítása
    onMounted(loadUserData)

    return {
      availableDates,
      getButtonClass,
      formatDate,
      navigateToDiary,
    }
  },
}
</script>

<style scoped>
.date-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

button.available {
  background-color: #4caf50;
  color: white;
}

button.completed {
  background-color: #2196f3;
  color: white;
}

button.disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

button:hover:not(.disabled) {
  background-color: #45a049;
}
</style>
