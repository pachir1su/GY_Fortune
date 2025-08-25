import dayjs from 'dayjs'

// Seeded RNG: name + birth + date
function xmur3(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}
function mulberry32(a) {
  return () => {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function seeded(name, birth, dateStr) {
  const seedBase = `${name}::${birth}::${dateStr}`
  const seedFn = xmur3(seedBase)
  return mulberry32(seedFn())
}
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)]
const between = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min

const summaries = [
  '작은 성취가 큰 자신감으로 이어지는 날이다.',
  '주변의 도움이 실질적인 발전으로 연결된다.',
  '오래 미뤄둔 일이 깔끔히 정리된다.',
  '새로운 아이디어가 현실적인 형태를 갖춘다.',
  '컨디션이 안정되고 집중력이 오른다.',
]
const advices = [
  '우선순위를 3가지로 줄여라.',
  '메모 앱 대신 종이로 구체화해라.',
  '연락이 끊긴 한 사람에게 안부를 전해라.',
  '휴대폰 배터리를 80%로 제한해 에너지 관리에 신경써라.',
  '30분 산책으로 머리를 식혀라.',
  '오늘은 데이터 백업을 실행해라.',
]
const colors = ['화이트', '네이비', '에메랄드', '버건디', '샌드베이지', '스카이블루']
const items  = ['볼펜', '에코백', '이어폰', '물병', '카드지갑', '손목시계']
const times  = ['오전 8시', '오전 10시', '정오', '오후 2시', '오후 4시', '오후 9시']

export function generateFortune(name, birth, date = dayjs()) {
  const d = date.format('YYYY-MM-DD')
  const rng = seeded(name.trim(), birth.trim(), d)
  return {
    date: d,
    summary: pick(rng, summaries),
    scores: {
      love:  between(rng, 40, 95),
      money: between(rng, 40, 95),
      health:between(rng, 40, 95),
      study: between(rng, 40, 95),
    },
    advice: [pick(rng, advices), pick(rng, advices)],
    lucky: {
      color: pick(rng, colors),
      item:  pick(rng, items),
      time:  pick(rng, times),
    },
  }
}
