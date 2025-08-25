import { useSearchParams, Link } from 'react-router-dom'
import { generateFortune } from '../lib/fortuneEngine.js'
import ShareCard from '../components/ShareCard.jsx'

function parseSeedBirth(seed='') {
  // seed 형식: YYYY-MM-DD|solar|ja_am
  const [date, cal, time] = (seed || '').split('|')
  return { date, cal: cal || 'solar', time: time || 'unknown' }
}

const TIME_LABELS = {
  unknown: '시간 모름',
  ja_am: '조자/朝子 (00:00~01:29)',
  chuk:  '축/丑 (01:30~03:29)',
  in:    '인/寅 (03:30~05:29)',
  myo:   '묘/卯 (05:30~07:29)',
  jin:   '진/辰 (07:30~09:29)',
  sa:    '사/巳 (09:30~11:29)',
  o:     '오/午 (11:30~13:29)',
  mi:    '미/未 (13:30~15:29)',
  sin:   '신/申 (15:30~17:29)',
  yu:    '유/酉 (17:30~19:29)',
  sul:   '술/戌 (19:30~21:29)',
  hae:   '해/亥 (21:30~23:29)',
  ja_pm: '야자/夜子 (23:30~23:59)',
}

export default function Result() {
  const [sp] = useSearchParams()
  const name  = sp.get('name') || ''
  const birthSeed = sp.get('birth') || ''
  const { date: birthDate, cal, time } = parseSeedBirth(birthSeed)

  if (!name || !birthSeed) {
    return (
      <div className="card">
        <p>입력 정보가 없습니다.</p>
        <Link to="/"><button className="btn">돌아가기</button></Link>
      </div>
    )
  }

  // 시드에 달력/시간을 포함했으므로 그대로 사용
  const f = generateFortune(name, birthSeed)

  return (
    <section className="hero">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{name}님의 {f.date} 운세</h2>
        <p className="muted" style={{marginTop: -8}}>생년월일: {birthDate || '—'} · 달력: {cal==='lunar' ? '음력' : '양력'} · 태어난 시간: {TIME_LABELS[time]}</p>

        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4,
                    background:'linear-gradient(90deg, var(--accent-1), var(--accent-2))',
                    WebkitBackgroundClip:'text', color:'transparent' }}>{f.summary}</p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <Metric label="연애운"  value={f.scores.love} />
          <Metric label="금전운"  value={f.scores.money} />
          <Metric label="건강운"  value={f.scores.health} />
          <Metric label="학업운"  value={f.scores.study} />
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>조언</h3>
          <ul>
            {f.advice.map((a, i) => (<li key={i}>{a}</li>))}
          </ul>
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>럭키 키</h3>
          <p>색상: {f.lucky.color} / 아이템: {f.lucky.item} / 시간: {f.lucky.time}</p>
        </div>

        <ShareCard title={`${name}님의 오늘 운세`} text={`${f.summary}\n연애:${f.scores.love} 금전:${f.scores.money} 건강:${f.scores.health} 학업:${f.scores.study}`} />

        <div style={{ marginTop: 16 }}>
          <Link to="/"><button className="btn">다시 하기</button></Link>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="meter" style={{ marginTop: 10 }}>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
