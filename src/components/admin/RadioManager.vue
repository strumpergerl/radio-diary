<template>
  <div class="radio-manager">
    <h3>Rádiók Listája</h3>
    <ul>
      <li v-for="radio in radios" :key="radio.id">
        <strong>ID:</strong> {{ radio.id }} | <strong>Név:</strong> {{ radio.name }} |
        <strong>Régiók:</strong> {{ radio.regions.join(', ') }}
        <button @click="deleteRadio(radio.id)">Törlés</button>
        <button @click="editRadio(radio)">Szerkesztés</button>
      </li>
    </ul>
    <form @submit.prevent="saveRadio">
      <h3>{{ isEditing ? 'Rádió Módosítása' : 'Új Rádió Hozzáadása' }}</h3>
      <input v-model="radioName" placeholder="Rádió neve" />
      <h4>Válaszd ki a régiókat:</h4>
      <select v-model="selectedRegions" multiple>
        <option v-for="region in regionsList" :key="region" :value="region">
          {{ region }}
        </option>
      </select>
      <button type="submit">{{ isEditing ? 'Módosítás Mentése' : 'Hozzáadás' }}</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore'

export default {
  name: 'RadioManager',
  setup() {
    const db = useFirestore()
    const radios = ref([])
    const radioName = ref('')
    const selectedRegions = ref([]) // Kiválasztott régiók listája
    const isEditing = ref(false)
    const editingRadioId = ref(null)

    // Magyar megyék listája
    const regionsList = [
      'Budapest',
      'Pest',
      'Baranya',
      'Bács-Kiskun',
      'Békés',
      'Borsod-Abaúj-Zemplén',
      'Csongrád-Csanád',
      'Fejér',
      'Győr-Moson-Sopron',
      'Hajdú-Bihar',
      'Heves',
      'Jász-Nagykun-Szolnok',
      'Komárom-Esztergom',
      'Nógrád',
      'Somogy',
      'Szabolcs-Szatmár-Bereg',
      'Tolna',
      'Vas',
      'Veszprém',
      'Zala',
    ]

    // Rádiók betöltése Firestore-ból
    const fetchRadios = async () => {
      const snapshot = await getDocs(collection(db, 'radios'))
      radios.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    }

    // Rádió mentése
    const saveRadio = async () => {
      if (isEditing.value) {
        // Rádió módosítása
        await updateDoc(doc(db, 'radios', editingRadioId.value), {
          name: radioName.value,
          regions: selectedRegions.value, // Régiók mentése
        })
        isEditing.value = false
        editingRadioId.value = null
      } else {
        // Új rádió hozzáadása
        await addDoc(collection(db, 'radios'), {
          name: radioName.value,
          regions: selectedRegions.value, // Régiók mentése
        })
      }

      radioName.value = ''
      selectedRegions.value = []
      fetchRadios()
    }

    // Rádió törlése
    const deleteRadio = async (id) => {
      await deleteDoc(doc(db, 'radios', id))
      fetchRadios()
    }

    // Rádió szerkesztése
    const editRadio = (radio) => {
      radioName.value = radio.name
      selectedRegions.value = radio.regions
      isEditing.value = true
      editingRadioId.value = radio.id
    }

    onMounted(fetchRadios)

    return {
      radios,
      radioName,
      selectedRegions,
      regionsList,
      isEditing,
      saveRadio,
      deleteRadio,
      editRadio,
    }
  },
}
</script>

<style scoped>
.radio-manager {
  margin-top: 20px;
}

form {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

button {
  margin-left: 10px;
}

input,
select {
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
