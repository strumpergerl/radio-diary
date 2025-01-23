<template>
  <div class="diary-page">
    <h1>Napló - {{ selectedDate }}</h1>

    <!-- Csatornák kiválasztása -->
    <div v-if="!radioChoicesSaved">
      <p>Válaszd ki a rádiókat, amelyeket hallgattál:</p>
      <ul class="radio-list">
        <li
          v-for="radio in availableRadios"
          :key="radio.id"
          @click="toggleRadioChoice(radio.id)"
          :class="{ selected: selectedRadios.includes(radio.id) }"
        >
          {{ radio.name }}
        </li>
      </ul>
      <button :disabled="selectedRadios.length === 0" @click="saveRadioChoices">Mentés</button>
    </div>

    <!-- Idősávok és platformok kiválasztása -->
    <div v-else>
      <p>Jelöld meg, hogy mikor és milyen platformon hallgattad a kiválasztott csatornákat:</p>
      <div v-for="radioId in selectedRadios" :key="radioId" class="radio-time-block">
        <h2>{{ getRadioName(radioId) }}</h2>

        <!-- Platform választó -->
        <div class="platform-selector">
          <label
            v-for="platform in platforms"
            :key="platform"
            :class="{ selected: selectedPlatform[radioId] === platform }"
          >
            <input
              type="radio"
              :name="'platform-' + radioId"
              :value="platform"
              v-model="selectedPlatform[radioId]"
            />
            {{ platformNames[platform] }}
          </label>
        </div>

        <!-- Idősáv kijelölő -->
        <div
          class="time-grid"
          @mousedown="startSelecting(radioId)"
          @mouseup="stopSelecting"
          @mouseleave="stopSelecting"
          @touchstart="startSelecting(radioId)"
          @touchmove="handleTouchMove(radioId, $event)"
          @touchend="stopSelecting"
        >
          <div
            v-for="time in timeSlots"
            :key="time"
            class="time-slot"
            :class="{ selected: isSelected(radioId, time) }"
            @mousedown="toggleTime(radioId, time)"
            @mouseenter="handleHover(radioId, time)"
          >
            {{ time }}
          </div>
        </div>
      </div>
      <button :disabled="!isAllPlatformsSelected" @click="saveTimeSlots">
        Idősávok és Platform Mentése
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestore } from 'vuefire'
import { useUserStore } from '../stores/userStore'
import { doc, setDoc } from 'firebase/firestore'

export default {
  name: 'DiaryPage',
  setup() {
    const route = useRoute()
    const db = useFirestore()
    const userStore = useUserStore()

    // URL-ből érkező dátum
    const selectedDate = route.query.date

    // Példa rádiók (Firestore-ból kellene betölteni)
    const availableRadios = ref([
      { id: 'radio1', name: 'Rádió 1' },
      { id: 'radio2', name: 'Rádió 2' },
      { id: 'radio3', name: 'Rádió 3' },
    ])

    // Platformok
    const platforms = ['traditional', 'stream', 'app']
    const platformNames = {
      traditional: 'Hagyományos rádió',
      stream: 'Stream',
      app: 'Applikáció',
    }

    // Állapotok
    const selectedRadios = ref([]) // Kiválasztott rádiók
    const selectedTimes = ref({}) // Idősávok rádiónként
    const toggleMode = ref(null) // Kijelölési mód (select/deselect)
    const isSelecting = ref(false) // Jelzi, hogy éppen kijelölés zajlik
    const selectedPlatform = ref({}) // Kiválasztott platform rádiónként
    const radioChoicesSaved = ref(false) // Csatornaválasztás mentett állapota

    // Idősávok generálása (06:00–24:00 negyedórás bontásban)
    const timeSlots = computed(() => {
      const slots = []
      for (let hour = 6; hour < 24; hour++) {
        for (let quarter = 0; quarter < 60; quarter += 15) {
          slots.push(`${hour.toString().padStart(2, '0')}:${quarter.toString().padStart(2, '0')}`)
        }
      }
      return slots
    })

    // Csatornák kiválasztása
    const toggleRadioChoice = (radioId) => {
      const index = selectedRadios.value.indexOf(radioId)
      if (index === -1) {
        selectedRadios.value.push(radioId)
      } else {
        selectedRadios.value.splice(index, 1)
      }
    }

    // Csatornák mentése
    const saveRadioChoices = async () => {
      const userId = userStore.userId
      const docRef = doc(db, 'userDiaries', userId)

      await setDoc(
        docRef,
        {
          entries: {
            [selectedDate]: {
              radioChoices: selectedRadios.value,
            },
          },
        },
        { merge: true },
      )

      radioChoicesSaved.value = true // Csatornaválasztás mentve
    }

    // Ellenőrzi, hogy minden rádióhoz ki van-e választva egy platform
    const isAllPlatformsSelected = computed(() => {
      return selectedRadios.value.every((radioId) => selectedPlatform.value[radioId])
    })

    // Kijelölés indítása adott rádiónál
    const startSelecting = (radioId) => {
      isSelecting.value = radioId // Aktuálisan kezelt rádió
    }

    // Kijelölés leállítása
    const stopSelecting = () => {
      isSelecting.value = false // Jelzi, hogy nincs aktív rádió
      toggleMode.value = null // Reset a módhoz
    }

    // Idősáv kijelölése vagy törlése adott rádiónál
    const toggleTime = (radioId, time) => {
      if (!selectedTimes.value[radioId]) {
        selectedTimes.value[radioId] = []
      }

      const index = selectedTimes.value[radioId].indexOf(time)

      if (index === -1) {
        // Kijelölés
        selectedTimes.value[radioId].push(time)
        toggleMode.value = 'select'
      } else {
        // Törlés
        selectedTimes.value[radioId].splice(index, 1)
        toggleMode.value = 'deselect'
      }
    }

    // Kijelölés mozgatás közben
    const handleHover = (radioId, time) => {
      if (!isSelecting.value || isSelecting.value !== radioId || !toggleMode.value) return

      const index = selectedTimes.value[radioId].indexOf(time)

      if (toggleMode.value === 'select' && index === -1) {
        selectedTimes.value[radioId].push(time)
      } else if (toggleMode.value === 'deselect' && index !== -1) {
        selectedTimes.value[radioId].splice(index, 1)
      }
    }

    // Érintéses húzás kezelése
    const handleTouchMove = (radioId, event) => {
      if (!isSelecting.value || isSelecting.value !== radioId) return

      const touchedElement = document.elementFromPoint(
        event.touches[0].clientX,
        event.touches[0].clientY,
      )
      const timeSlot = touchedElement?.textContent?.trim()

      if (timeSlot) {
        handleHover(radioId, timeSlot)
      }
    }

    // Ellenőrzi, hogy egy idősáv ki van-e jelölve az adott rádiónál
    const isSelected = (radioId, time) => {
      return selectedTimes.value[radioId]?.includes(time) || false
    }

    // Idősávok és platformok mentése
    const saveTimeSlots = async () => {
      const userId = userStore.userId
      const docRef = doc(db, 'userDiaries', userId)

      const timeData = {}
      selectedRadios.value.forEach((radioId) => {
        timeData[radioId] = {
          timeSlots: selectedTimes.value[radioId] || [],
          platform: selectedPlatform.value[radioId] || null,
        }
      })

      await setDoc(
        docRef,
        {
          entries: {
            [selectedDate]: {
              details: timeData,
            },
          },
        },
        { merge: true },
      )

      alert('Idősávok és platformok mentve!')
    }

    // Rádió nevének visszakeresése
    const getRadioName = (radioId) => {
      const radio = availableRadios.value.find((r) => r.id === radioId)
      return radio ? radio.name : ''
    }

    return {
      selectedDate,
      availableRadios,
      platforms,
      platformNames,
      selectedRadios,
      selectedTimes,
      selectedPlatform,
      radioChoicesSaved,
      timeSlots,
      toggleRadioChoice,
      saveRadioChoices,
      toggleTime,
      toggleMode,
      handleHover,
      handleTouchMove,
      isSelected,
      saveTimeSlots,
      getRadioName,
      isAllPlatformsSelected,
      startSelecting,
      stopSelecting,
    }
  },
}
</script>

<style scoped>
.radio-list {
  list-style-type: none;
  padding: 0;
}

.radio-list li {
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: #f9f9f9;
}

.radio-list li.selected {
  background-color: #007bff;
  color: white;
}

.platform-selector {
  margin-bottom: 10px;
}

.platform-selector label {
  margin-right: 10px;
  cursor: pointer;
}

.platform-selector input {
  margin-right: 5px;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  user-select: none; /* Megakadályozza a szöveg kijelölését */
}

.time-slot {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.time-slot.selected {
  background-color: #007bff;
  color: white;
}
</style>
