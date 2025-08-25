// src/engine/calendar.js
// Minimal calendar helpers; real lunar/solar conversion & 24절기는 향후 교체 예정.
export function toDateParts(iso){ // "YYYY-MM-DD"
  const [y,m,d] = iso.split('-').map(Number)
  return { y, m, d }
}
// Julian Day Number
export function toJDN(y, m, d){
  // Fliegel-Van Flandern algorithm (Gregorian)
  const a = Math.floor((14 - m) / 12)
  const y2 = y + 4800 - a
  const m2 = m + 12*a - 3
  return d + Math.floor((153*m2 + 2)/5) + 365*y2 + Math.floor(y2/4) - Math.floor(y2/100) + Math.floor(y2/400) - 32045
}
export function fromJDN(j){ // Return weekday 0=Sun..6=Sat
  return j % 7
}

// Placeholder: 절기 경계는 미구현(추후 테이블/천문식으로 보강)
export function monthBranchApprox(m){
  // 간단 매핑(절기 미적용): 인(1)~축(12)
  const order = ['인','묘','진','사','오','미','신','유','술','해','자','축']
  return order[(m-1) % 12]
}
