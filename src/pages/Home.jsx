import { useNavigate } from 'react-router-dom'
import { useFortuneStore } from '../store/useFortuneStore.js'

export default function Home() {
  const nav = useNavigate()
  const { name, birth, setName, setBirth } = useFortuneStore()

  const canSubmit = name.trim() && /^\d{4}-\d{2}-\d{2}$/.test(birth)

  const submit = () => {
    const params = new URLSearchParams({ name: name.trim(), birth })
    nav(`/result?${params.toString()}`)
  }

  return (
    <section className="hero">
      <div className="row">
        <div>
          <span className="pill"><span className="dot" /> 오늘의 인사이트</span>
          <h1>AI 운세로 <span style={{background:'linear-gradient(90deg, var(--accent-1), var(--accent-2))', WebkitBackgroundClip:'text', color:'transparent'}}>하루의 방향</span>을 잡으세요</h1>
          <p className="subtle">이름과 생년월일만 입력하면 매일 고정된 시드로 재현 가능한 운세 결과를 제공합니다. 중요한 결정 전, 간단히 체크하세요.</p>
          <div className="grid" style={{gridTemplateColumns:'repeat(3, minmax(0,1fr))', marginTop: 10}}>
            <Badge label="연애운" />
            <Badge label="금전운" />
            <Badge label="학업운" />
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>빠른 시작</h3>
          <div className="grid">
            <label>
              이름
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 거녕"
                autoFocus
              />
            </label>
            <label>
              생년월일
              <input
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </label>
            <button className={`btn btn-primary`} onClick={submit} disabled={!canSubmit}>오늘의 운세 보기</button>
          </div>
          <p className="muted" style={{marginTop:12, fontSize:12}}>개인정보는 저장되지 않으며, 브라우저 내에서만 처리됩니다.</p>
        </div>
      </div>
    </section>
  )
}

function Badge({ label }) {
  return (
    <div className="card" style={{padding:'10px 12px'}}>
      <span style={{fontWeight:700}}>{label}</span>
    </div>
  )
}
