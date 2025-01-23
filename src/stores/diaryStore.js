import { defineStore } from 'pinia'

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    selectedRadios: [],
    selectedTimes: {},
  }),
  actions: {
    setRadios(radios) {
      this.selectedRadios = radios
    },
    setTimes(radioId, times) {
      this.selectedTimes[radioId] = times
    },
  },
})
