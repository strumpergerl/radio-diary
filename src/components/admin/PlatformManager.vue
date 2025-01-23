<template>
  <div class="platform-manager">
    <h3>Platformok Listája</h3>
    <ul>
      <li v-for="platform in platforms" :key="platform.id">
        <strong>ID:</strong> {{ platform.id }} | <strong>Név:</strong> {{ platform.name }}
        <button @click="deletePlatform(platform.id)">Törlés</button>
        <button @click="editPlatform(platform)">Szerkesztés</button>
      </li>
    </ul>
    <form @submit.prevent="savePlatform">
      <h3>{{ isEditing ? 'Platform Módosítása' : 'Új Platform Hozzáadása' }}</h3>
      <input v-model="platformName" placeholder="Platform neve" />
      <button type="submit">{{ isEditing ? 'Módosítás Mentése' : 'Hozzáadás' }}</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore'

export default {
  name: 'PlatformManager',
  setup() {
    const db = useFirestore()
    const platforms = ref([])
    const platformName = ref('')
    const isEditing = ref(false)
    const editingPlatformId = ref(null)

    // Platformok betöltése Firestore-ból
    const fetchPlatforms = async () => {
      const snapshot = await getDocs(collection(db, 'platforms'))
      platforms.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    }

    // Platform mentése
    const savePlatform = async () => {
      if (isEditing.value) {
        // Platform módosítása
        await updateDoc(doc(db, 'platforms', editingPlatformId.value), {
          name: platformName.value,
        })
        isEditing.value = false
        editingPlatformId.value = null
      } else {
        // Új platform hozzáadása
        await addDoc(collection(db, 'platforms'), {
          name: platformName.value,
        })
      }

      platformName.value = ''
      fetchPlatforms()
    }

    // Platform törlése
    const deletePlatform = async (id) => {
      await deleteDoc(doc(db, 'platforms', id))
      fetchPlatforms()
    }

    // Platform szerkesztése
    const editPlatform = (platform) => {
      platformName.value = platform.name
      isEditing.value = true
      editingPlatformId.value = platform.id
    }

    onMounted(fetchPlatforms)

    return {
      platforms,
      platformName,
      isEditing,
      savePlatform,
      deletePlatform,
      editPlatform,
    }
  },
}
</script>

<style scoped>
.platform-manager {
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

input {
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
