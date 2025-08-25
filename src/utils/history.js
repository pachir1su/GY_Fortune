// src/utils/history.js
const KEY = 'gy_fortune_history_v1'
export function loadHistory(){
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
export function pushHistory(item){
  const list = loadHistory().filter(x => x.hash !== item.hash)
  list.unshift(item)
  while(list.length > 10) list.pop()
  localStorage.setItem(KEY, JSON.stringify(list))
}
