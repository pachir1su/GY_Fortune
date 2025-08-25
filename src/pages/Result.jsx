import { useSearchParams, Link } from 'react-router-dom'
import { generateFortune } from '../lib/fortuneEngine.js'
import ShareCard from '../components/ShareCard.jsx'

// local seeded RNG so 확장 섹션도 재현 가능
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
function makeRng(seed) { const s = xmur3(seed)(); return mulberry32(s) }
function randint(rng, min, max){ return Math.floor(rng()*(max-min+1))+min }

function parseSeedBirth(seed='') {
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

  const f = generateFortune(name, birthSeed)
  const rng = makeRng(name + '|' + birthSeed)

  // 간단한 예시용: 사주 격자/오행/대운/위기 생성(실제 명리 계산 아님, 시드 기반 시각요소)
  const stems = ['갑','을','병','정','무','기','경','신','임','계']
  const branches = ['자','축','인','묘','진','사','오','미','신','유','술','해']
  const tenGods = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인']
  const fourPillars = {
    year: { heaven: pick(stems, rng), earth: pick(branches, rng), ten: pick(tenGods, rng) },
    month:{ heaven: pick(stems, rng), earth: pick(branches, rng), ten: pick(tenGods, rng) },
    day:  { heaven: pick(stems, rng), earth: pick(branches, rng), ten: pick(tenGods, rng) },
    time: { heaven: pick(stems, rng), earth: pick(branches, rng), ten: pick(tenGods, rng) },
  }
  const five = {
    wood: randint(rng,0,5),
    fire: randint(rng,0,5),
    earth: randint(rng,0,5),
    metal: randint(rng,0,5),
    water: randint(rng,0,5),
  }
  const total = Math.max(1, five.wood + five.fire + five.earth + five.metal + five.water)
  const fivePct = { wood: Math.round(five.wood/total*100), fire: Math.round(five.fire/total*100), earth: Math.round(five.earth/total*100), metal: Math.round(five.metal/total*100), water: Math.round(five.water/total*100) }
  const strengthIdx = randint(rng, 0, 6) // 신약~극왕
  const decadeStart = 2
  const decades = Array.from({length:7}, (_,i)=> 2008 + i*10)
  const ages = Array.from({length:7}, (_,i)=> 2 + i*10)
  const risks = makeRisks(rng)

  return (
    <section className="hero noselect">
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

        <div className="grid-2" style={{ marginTop: 18 }}>
          <FourPillarsCard pillars={fourPillars} name={name} birthDate={birthDate} />
          <DecadeLuck decades={decades} ages={ages} />
        </div>

        <div className="grid-2" style={{ marginTop: 18 }}>
          <FiveElements data={fivePct} />
          <RisksCard risks={risks} />
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

function pick(arr, rng){ return arr[Math.floor(rng()*arr.length)] }

function Metric({ label, value }) {
  return (
    <div className="panel" style={{ padding: 12 }}>
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

function FourPillarsCard({ pillars, name, birthDate }) {
  const { year, month, day, time } = pillars
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>사주 격자(예시)</h3>
      <p className="small">{name}님의 사주 · {birthDate || '—'}</p>
      <table className="table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th>時</th><th>日</th><th>月</th><th>年</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{time.ten}</td><td>{day.ten}</td><td>{month.ten}</td><td>{year.ten}</td>
          </tr>
          <tr>
            <td>{time.heaven}</td><td>{day.heaven}</td><td>{month.heaven}</td><td>{year.heaven}</td>
          </tr>
          <tr>
            <td>{time.earth}</td><td>{day.earth}</td><td>{month.earth}</td><td>{year.earth}</td>
          </tr>
        </tbody>
      </table>
      <p className="small">* 시드 기반 데모로 실제 명리 계산과 다를 수 있다.</p>
    </div>
  )
}

function DecadeLuck({ decades, ages }) {
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>대운 표(예시)</h3>
      <div className="hr" />
      <div className="grid" style={{ gridTemplateColumns:'repeat(7, 1fr)' }}>
        {decades.map((y, i) => (
          <div key={y} className="card" style={{padding:10, textAlign:'center'}}>
            <div style={{fontWeight:800}}>{y}</div>
            <div className="small">{ages[i]}세</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FiveElements({ data }) {
  const labels = [
    { key:'wood',  name:'목 木' },
    { key:'fire',  name:'화 火' },
    { key:'earth', name:'토 土' },
    { key:'metal', name:'금 金' },
    { key:'water', name:'수 水' },
  ]
  const yongsin = labels.sort((a,b)=> data[b.key]-data[a.key])[0] // 가장 높은 비율 예시
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>오행 & 용신(예시)</h3>
      <div className="grid">
        {labels.map(({key, name}) => (
          <div key={key}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
              <span>{name}</span><span>{data[key]}%</span>
            </div>
            <div className="bar"><i style={{width:`${data[key]}%`}}/></div>
          </div>
        ))}
      </div>
      <div className="hr" />
      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <span className="badge-soft">용신</span>
        <strong>{yongsin.name.split(' ')[0]}</strong>
        <span className="small">* 데모 계산</span>
      </div>
    </div>
  )
}

function RisksCard({ risks }) {
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>예상 리스크(예시)</h3>
      <div className="grid">
        {risks.map((r, i) => (
          <div className="risk-item" key={i}>
            <strong className="risk-index">{strIndex(i+1)}</strong>{r}
          </div>
        ))}
      </div>
      <p className="small">* 개인 상항 고려 필요. 중요한 결정은 다면적 판단 권장.</p>
    </div>
  )
}

function strIndex(n){ return ('0'+n).slice(-2) }
function makeRisks(rng){
  const pool = [
    '잦은 이동/출장으로 생활 리듬 붕괴',
    '무리한 투자로 인한 현금흐름 압박',
    '평소 관리 소홀로 인한 건강 이슈',
    '주변의 오해/커뮤니케이션 갈등',
    '새 프로젝트 과도한 스코프 확장',
    '과로로 인한 컨디션 저하',
    '집안 수리/이사 등 주거 변수',
  ]
  const out = new Set()
  while(out.size < 3){ out.add(pool[Math.floor(rng()*pool.length)]) }
  return Array.from(out)
}
