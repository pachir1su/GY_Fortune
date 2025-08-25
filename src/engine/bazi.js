// src/engine/bazi.js
import { toJDN, monthBranchApprox } from './calendar.js'
import { sexagenaryIndex, stemOf, branchOf, yearStemBranch } from './ganzhi.js'

export function fourPillars(isoDate, hourBlock=0){
  // isoDate: "YYYY-MM-DD", hourBlock: 0..11(자~해), unknown => 0 처리
  const [y,m,d] = isoDate.split('-').map(Number)
  const jdn = toJDN(y,m,d)
  // Day pillar (approx): index from pseudo sexagenary
  const dayIdx = sexagenaryIndex(jdn)
  const day = { heaven: stemOf(dayIdx), earth: branchOf(dayIdx), ten: '?' }

  // Year pillar: approx mapping using 1984 갑자 기준
  const ysb = yearStemBranch(y)
  const year = { heaven: ysb.stem, earth: ysb.branch, ten: '?' }

  // Month pillar: very rough using month -> branch; stem ignored
  const mb = monthBranchApprox(m)
  const month = { heaven: '—', earth: mb, ten: '?' }

  // Time pillar: branch from hour block
  const time = { heaven: '—', earth: branchOf(hourBlock), ten: '?' }

  return { year, month, day, time }
}
