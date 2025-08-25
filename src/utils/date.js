// src/utils/date.js
export function isLeap(year){ return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) }
export function validYMD(yyyy, mm, dd){
  if (!yyyy || !mm || !dd) return false
  if (yyyy < 1900 || yyyy > 2035) return false
  if (mm < 1 || mm > 12) return false
  const mdays = [31, isLeap(yyyy) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return dd >= 1 && dd <= mdays[mm-1]
}
export function parseDigits(yyyymmdd){
  const s = (yyyymmdd||'').replace(/\D+/g,'')
  if (s.length !== 8) return null
  const y = +s.slice(0,4), m = +s.slice(4,6), d = +s.slice(6,8)
  return { y, m, d, ok: validYMD(y,m,d) }
}
export function fmtDot(yyyymmdd){
  const s = (yyyymmdd||'').replace(/\D+/g,'').slice(0,8)
  if (s.length <= 4) return s
  if (s.length <= 6) return s.slice(0,4) + '.' + s.slice(4)
  return s.slice(0,4) + '.' + s.slice(4,6) + '.' + s.slice(6,8)
}
export function toHyphen(yyyymmdd){
  const s = (yyyymmdd||'').replace(/\D+/g,'')
  if (s.length !== 8) return ''
  return s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6,8)
}
