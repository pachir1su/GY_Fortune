// src/engine/nlg.js
export function labelFromScore(v){
  if (v >= 80) return '높음'
  if (v >= 60) return '보통'
  return '낮음'
}
export function tip(label, v, ctx){
  const low = {
    '연애운': '먼저 안부를 전해 보세요. 작은 대화가 분위기를 바꿉니다.',
    '금전운': '소액 지출 점검 후 구독 1개만 줄여 보세요.',
    '건강운': '물 2잔 + 15분 걷기만으로도 리듬이 회복됩니다.',
    '학업운': '쉬운 문제로 워밍업하고 30분 집중 구간을 만드세요.',
  }
  const mid = {
    '연애운': '대화가 잘 풀리는 날입니다. 약속 시간을 여유 있게.',
    '금전운': '예산을 1% 상향하고 계획된 지출만 실행하세요.',
    '건강운': '가벼운 스트레칭과 카페인 컷오프(오후 3시 이후 제한).',
    '학업운': '50분 집중·10분 휴식 루틴을 권장합니다.',
  }
  const high = {
    '연애운': '솔직한 표현이 통합니다. 짧은 메시지로도 충분합니다.',
    '금전운': '가격 비교 후 필요한 지출에 실행하기 좋은 날입니다.',
    '건강운': '컨디션 양호. 가벼운 유산소로 탄력 유지.',
    '학업운': '난이도 높은 과제를 먼저 공략해도 괜찮습니다.',
  }
  if (v >= 80) return high[label]
  if (v >= 60) return mid[label]
  return low[label]
}

export function tomorrowPrep(ctx){
  const map = {
    morning: '알람을 10분 일찍 맞추고, 내일 우선순위 1개만 써두세요.',
    afternoon: '낮 컨디션 유지를 위해 500ml 물병을 채워 두세요.',
    evening: '취침 1시간 전 화면을 줄이고, 알람 확인으로 마무리하세요.',
  }
  return map[ctx.daypart] || '내일 가장 먼저 할 일 하나만 메모장에 적어 놓으세요.'
}
