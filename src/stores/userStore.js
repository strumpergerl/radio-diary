import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // Az állapot inicializálása
  state: () => ({
    userId: '', // Felhasználó ID az URL-ből
    region: '', // Felhasználó régiója az URL-ből
    isAuthenticated: false, // Opció: ha az autentikáció szükséges a későbbiekben
    firstVisitDate: '', // Első látogatás dátuma
    selectedPlatform: '', // Felhasználó által kiválasztott platform
  }),

  // Getterek a gyorsabb hozzáféréshez (opcionális)
  getters: {
    getUserId: (state) => state.userId,
    getRegion: (state) => state.region,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  // Akciók az állapot frissítéséhez
  actions: {
    // Felhasználói adatok frissítése (pl. URL-ből kapott adatok beállítása)
    setUser({ userId, region }) {
      this.userId = userId
      this.region = region
    },

    setFirstVisitDate(date) {
      this.firstVisitDate = date
    },

    // Opcionális: autentikáció kezelése
    authenticate() {
      this.isAuthenticated = true
    },

    logout() {
      this.isAuthenticated = false
      this.userId = ''
      this.region = ''
    },
  },
})
