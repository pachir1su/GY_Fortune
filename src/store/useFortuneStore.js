import { create } from 'zustand'

export const useFortuneStore = create((set) => ({
  name: '',
  birth: '',
  setName: (v) => set({ name: v }),
  setBirth: (v) => set({ birth: v }),
}))
