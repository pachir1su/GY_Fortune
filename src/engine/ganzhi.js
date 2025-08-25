// src/engine/ganzhi.js
const stems = ['갑','을','병','정','무','기','경','신','임','계']
const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해']
export { stems, branches }

export function sexagenaryIndex(jdn){ // 0..59
  // Day count relative to a known甲子日 기준(1984-02-02 JDN=2445748 was 甲子? We'll approximate using offset)
  const baseJdn = 2440588 // 1970-01-01 (not exact 甲子, but stable pseudo index)
  return (jdn - baseJdn) % 60 < 0 ? ((jdn - baseJdn) % 60) + 60 : (jdn - baseJdn) % 60
}
export function stemOf(idx){ return stems[idx % 10] }
export function branchOf(idx){ return branches[idx % 12] }

export function yearStemBranch(y){
  // 1984 was 갑자년(甲子) : index 0
  const offset = y - 1984
  const stem = stems[(0 + offset) % 10 < 0 ? (0 + offset)%10 + 10 : (0+offset)%10]
  const branch = branches[(0 + offset) % 12 < 0 ? (0 + offset)%12 + 12 : (0+offset)%12]
  return { stem, branch }
}
