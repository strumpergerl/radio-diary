import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'

// Naplóbejegyzés mentése
export const saveDiaryEntry = async (entry) => {
  const diaryCollection = collection(db, 'diary')
  await addDoc(diaryCollection, entry)
}

// Felhasználó összes naplóbejegyzésének lekérése
export const fetchDiaryEntries = async (userId) => {
  const diaryCollection = collection(db, 'diary')
  const q = query(diaryCollection, where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function fetchRadiosCollection() {
  const radiosCollection = collection(db, 'radios')
  const querySnapshot = await getDocs(radiosCollection)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function fetchPlatformsCollection() {
  const platformsCollection = collection(db, 'platforms')
  const querySnapshot = await getDocs(platformsCollection)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
