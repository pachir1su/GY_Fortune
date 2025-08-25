export default function ShareCard({ title, text }) {
  const share = async () => {
    const data = { title, text }
    if (navigator.share) {
      await navigator.share(data)
      return
    }
    await navigator.clipboard.writeText(`${title}\n\n${text}`)
    alert('클립보드에 복사되었습니다.')
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>공유하기</h3>
      <button className="btn btn-primary" onClick={share}>공유 / 복사</button>
    </div>
  )
}
