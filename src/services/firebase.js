import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBK4cXj92V0_O3j1-VCNdH36gu3KbdEIVw',
  authDomain: 'radio-diary.firebaseapp.com',
  projectId: 'radio-diary',
  storageBucket: 'radio-diary.firebasestorage.app',
  messagingSenderId: '87236552510',
  appId: '1:87236552510:web:2cb493072da0d13904ee6f',
}

// Firebase inicializálás
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

// Alapértelmezett export
export default firebaseApp

export { db }
