import { create } from 'zustand'

export const useFortuneStore = create((set) => ({
  name: '',
  birth: '',           // 표시용: YYYY.MM.DD
  calendarType: 'solar', // 'solar' | 'lunar'
  birthTime: 'unknown',  // 아래 옵션 중 하나
  setName: (v) => set({ name: v }),
  setBirth: (v) => set({ birth: v }),
  setCalendarType: (v) => set({ calendarType: v }),
  setBirthTime: (v) => set({ birthTime: v }),
}))
