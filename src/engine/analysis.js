// src/engine/analysis.js
import { stems, branches } from './ganzhi.js'

const stemElement = {
  '갑':'목','을':'목','병':'화','정':'화','무':'토','기':'토','경':'금','신':'금','임':'수','계':'수'
}
const branchElement = {
  '자':'수','축':'토','인':'목','묘':'목','진':'토','사':'화','오':'화','미':'토','신':'금','유':'금','술':'토','해':'수'
}
const elementKey = { '목':'wood','화':'fire','토':'earth','금':'metal','수':'water' }

export function countElements(pillars){
  const tally = { wood:0, fire:0, earth:0, metal:0, water:0 }
  for (const p of [pillars.year, pillars.month, pillars.day, pillars.time]){
    if (stemElement[p.heaven]) tally[elementKey[stemElement[p.heaven]]]++
    if (branchElement[p.earth]) tally[elementKey[branchElement[p.earth]]]++
  }
  return tally
}

export function inferStrength(tally){
  // naive: 강세 요소 비율로 신강/신약 레벨 0..6
  const arr = Object.values(tally)
  const max = Math.max(...arr), sum = arr.reduce((a,b)=>a+b,0)||1
  const ratio = max / sum
  if (ratio >= 0.40) return 5
  if (ratio >= 0.35) return 4
  if (ratio >= 0.30) return 3
  if (ratio >= 0.25) return 2
  if (ratio >= 0.20) return 1
  return 0
}

export function decadeLuck(startAge=2, count=7){
  const years = Array.from({length:count}, (_,i)=> 2008 + i*10)
  const ages = Array.from({length:count}, (_,i)=> startAge + i*10)
  return { years, ages }
}
