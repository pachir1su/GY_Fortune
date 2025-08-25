import { useSearchParams, Link } from 'react-router-dom'
import { generateFortune } from '../lib/fortuneEngine.js'
import { fourPillars } from '../engine/bazi.js'
import { countElements, inferStrength, decadeLuck } from '../engine/analysis.js'
import { labelFromScore, tip, tomorrowPrep } from '../engine/nlg.js'
import { pushHistory } from '../utils/history.js'
import { useEffect } from 'react'

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
const BRANCH_INDEX = { '자':0,'축':1,'인':2,'묘':3,'진':4,'사':5,'오':6,'미':7,'신':8,'유':9,'술':10,'해':11 }
function timeToBlock(timeValue){
  const idx = {unknown:0, ja_am:0, chuk:1, in:2, myo:3, jin:4, sa:5, o:6, mi:7, sin:8, yu:9, sul:10, hae:11, ja_pm:0}[timeValue||'unknown']
  return idx
}
function nowDaypart(){
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

export default function Result(){
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
  const pillars = fourPillars(birthDate, timeToBlock(time))
  const tally = countElements(pillars)
  const strength = inferStrength(tally)
  const dec = decadeLuck(2,7)

  // history push once
  useEffect(()=>{
    const hash = btoa(unescape(encodeURIComponent(name+'|'+birthSeed))).slice(0,24)
    pushHistory({ hash, name, birth: birthDate, cal, time, summary: f.summary, date: f.date })
  }, [])

  const items = [
    { key:'연애운', value:f.scores.love },
    { key:'금전운', value:f.scores.money },
    { key:'건강운', value:f.scores.health },
    { key:'학업운', value:f.scores.study },
  ]
  const ctx = { daypart: nowDaypart() }

  return (
    <section className="hero">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{name}님의 {f.date} 운세</h2>
        <p className="muted" style={{marginTop: -8}}>생년월일: {birthDate || '—'} · 달력: {cal==='lunar' ? '음력' : '양력'} · 태어난 시간: {TIME_LABELS[time]}</p>

        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{f.summary}</p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {items.map(it=>(<Metric key={it.key} label={it.key} value={it.value} />))}
        </div>

        <div className="grid-2" style={{ marginTop: 18 }}>
          <FourPillarsCard pillars={pillars} name={name} birthDate={birthDate} />
          <DecadeLuck years={dec.years} ages={dec.ages} />
        </div>

        <div className="grid-2" style={{ marginTop: 18 }}>
          <FiveElements data={tally} />
          <UserFriendly name={name} items={items} ctx={ctx} />
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>럭키 키</h3>
          <p>색상: {f.lucky.color} / 아이템: {f.lucky.item} / 시간: {f.lucky.time}</p>
        </div>

        <div style={{ marginTop: 16 }}>
          <Link to="/"><button className="btn">다시 하기</button></Link>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }){
  const tag = (value>=80?'높음': value>=60?'보통':'낮음')
  return (
    <div className="panel" style={{ padding: 12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>{label}</span>
        <span className="badge-soft">{tag}</span>
      </div>
      <div className="meter" style={{ marginTop: 10 }}><i style={{ width: `${value}%` }} /></div>
    </div>
  )
}

function FourPillarsCard({ pillars, name, birthDate }){
  const { year, month, day, time } = pillars
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>사주 격자(예시)</h3>
      <p className="muted small">{name}님의 사주 · {birthDate || '—'}</p>
      <table className="table" style={{ marginTop: 8 }}>
        <thead><tr><th>時</th><th>日</th><th>月</th><th>年</th></tr></thead>
        <tbody>
          <tr><td>{time.ten||'—'}</td><td>{day.ten||'—'}</td><td>{month.ten||'—'}</td><td>{year.ten||'—'}</td></tr>
          <tr><td>{time.heaven}</td><td>{day.heaven}</td><td>{month.heaven}</td><td>{year.heaven}</td></tr>
          <tr><td>{time.earth}</td><td>{day.earth}</td><td>{month.earth}</td><td>{year.earth}</td></tr>
        </tbody>
      </table>
      <p className="muted small">* 절기/정밀 간지는 향후 엔진 업그레이드로 보강 예정.</p>
    </div>
  )
}

function DecadeLuck({ years, ages }){
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>대운 표(예시)</h3>
      <div className="hr" />
      <div className="grid" style={{ gridTemplateColumns:'repeat(7, 1fr)' }}>
        {years.map((y,i)=>(
          <div key={y} className="card" style={{padding:10, textAlign:'center'}}>
            <div style={{fontWeight:800}}>{y}</div>
            <div className="muted small">{ages[i]}세</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FiveElements({ data }){
  const list = [
    { key:'wood',  name:'목 木', color:'var(--five-wood)' },
    { key:'fire',  name:'화 火', color:'var(--five-fire)' },
    { key:'earth', name:'토 土', color:'var(--five-earth)' },
    { key:'metal', name:'금 金', color:'var(--five-metal)' },
    { key:'water', name:'수 水', color:'var(--five-water)' },
  ]
  const total = list.reduce((s,it)=> s + (data[it.key]||0), 0) || 1
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>오행 분포(예시)</h3>
      <div className="grid">
        {list.map(it=>{
          const v = Math.round((data[it.key]||0)/total*100)
          return (
            <div key={it.key}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:4}}>
                <span>{it.name}</span><span>{v}%</span>
              </div>
              <div className="bar"><i style={{width:`${v}%`, background: it.color}}/></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function UserFriendly({ name, items, ctx }){
  return (
    <div className="panel">
      <h3 style={{marginTop:0}}>오늘의 요약</h3>
      <p><strong>{name}</strong>님을 위한 친화적 해석입니다. 점수를 라벨로 읽고, 바로 실행 가능한 팁을 곁들였습니다.</p>
      <div className="grid">
        {items.map(it => (
          <div key={it.key} className="card" style={{padding:12}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span>{it.key}</span>
              <span className="badge-soft">{labelFromScore(it.value)}</span>
            </div>
            <div className="muted small" style={{marginTop:6}}>{tip(it.key, it.value, ctx)}</div>
          </div>
        ))}
      </div>
      <div className="hr" />
      <h4 style={{margin:'6px 0'}}>내일을 위한 준비 1</h4>
      <p className="muted">{tomorrowPrep(ctx)}</p>
    </div>
  )
}
