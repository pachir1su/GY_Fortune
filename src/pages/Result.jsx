import { useSearchParams, Link } from 'react-router-dom'
import { generateFortune } from '../lib/fortuneEngine.js'
import ShareCard from '../components/ShareCard.jsx'

export default function Result() {
  const [sp] = useSearchParams()
  const name  = sp.get('name') || ''
  const birth = sp.get('birth') || ''

  if (!name || !birth) {
    return (
      <div className="card">
        <p>입력 정보가 없습니다.</p>
        <Link to="/"><button className="btn">돌아가기</button></Link>
      </div>
    )
  }

  const f = generateFortune(name, birth)

  return (
    <section className="hero">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{name}님의 {f.date} 운세</h2>
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
