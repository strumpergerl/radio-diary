<template>
  <div class="radio-selector">
    <h3>Válaszd ki a hallgatott rádiókat</h3>
    <div v-if="radios.length > 0">
      <div v-for="radio in radios" :key="radio.id" class="radio-option">
        <input type="checkbox" :id="radio.id" :value="radio.id" v-model="selectedRadios" />
        <label :for="radio.id">{{ radio.name }}</label>
      </div>
    </div>
    <div v-else>
      <p>Nincs elérhető rádió ebben a régióban.</p>
    </div>
    <button @click="saveSelection">Mentés</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useFirestore } from 'vuefire' // Firestore integráció
import { useUserStore } from '../stores/userStore' // Pinia store a felhasználói adatokhoz
import { getDocs, collection } from 'firebase/firestore' // Moduláris API import

export default {
  name: 'RadioSelector',
  setup() {
    const db = useFirestore()
    const userStore = useUserStore()
    const radios = ref([])
    const selectedRadios = ref([])

    // Rádiók betöltése Firestore-ból

    const loadRadios = async () => {
      try {
        const radiosCollection = collection(db, 'radios') // 'radios' gyűjtemény lekérése
        const snapshot = await getDocs(radiosCollection) // Dokumentumok lekérése
        radios.value = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((radio) => radio.regions.includes(userStore.region))
      } catch (error) {
        console.error('Hiba a rádiók betöltésekor:', error)
      }
    }

    // Kiválasztott rádiók mentése Firestore-ba
    const saveSelection = async () => {
      try {
        const userId = userStore.userId
        const userRadiosRef = db.collection('userRadios').doc(userId)
        await userRadiosRef.set({ selectedRadios: selectedRadios.value }, { merge: true })
        alert('Kiválasztott rádiók mentve!')
      } catch (error) {
        console.error('Hiba a mentés során:', error)
      }
    }

    onMounted(() => {
      loadRadios()
    })

    return {
      radios,
      selectedRadios,
      saveSelection,
    }
  },
}
</script>

<style scoped>
.radio-selector {
  max-width: 400px;
  margin: 0 auto;
}
.radio-option {
  margin: 5px 0;
}
</style>
