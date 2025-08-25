import { useState } from 'react'

export default function ShareCard({ title, text }) {
  const [msg, setMsg] = useState('')

  const share = async () => {
    const data = { title, text }
    try {
      if (navigator.share) {
        await navigator.share(data)
        setMsg('공유 창이 열렸습니다. (미지원 브라우저에서는 복사로 대체)')
        return
      }
    } catch (e) {
      // fallthrough to clipboard
    }
    try {
      await navigator.clipboard.writeText(`${title}\n\n${text}`)
      setMsg('클립보드에 복사되었습니다. 붙여넣기(Ctrl+V)로 공유하세요.')
    } catch (e) {
      setMsg('복사가 제한되었습니다. 텍스트를 직접 선택해 복사하세요.')
    }
    setTimeout(()=>setMsg(''), 2500)
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>공유하기</h3>
      <button className="btn btn-primary" onClick={share}>공유 / 복사</button>
      {msg && <p className="small" style={{marginTop:8}}>{msg}</p>}
    </div>
  )
}
