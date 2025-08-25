import React, { useEffect, useRef, useState } from 'react'

const OPTIONS = [
  { value: 'unknown', label: '시간 모름' },
  { value: 'ja_am',  label: '조자/朝子 (00:00~01:29)' },
  { value: 'chuk',   label: '축/丑 (01:30~03:29)' },
  { value: 'in',     label: '인/寅 (03:30~05:29)' },
  { value: 'myo',    label: '묘/卯 (05:30~07:29)' },
  { value: 'jin',    label: '진/辰 (07:30~09:29)' },
  { value: 'sa',     label: '사/巳 (09:30~11:29)' },
  { value: 'o',      label: '오/午 (11:30~13:29)' },
  { value: 'mi',     label: '미/未 (13:30~15:29)' },
  { value: 'sin',    label: '신/申 (15:30~17:29)' },
  { value: 'yu',     label: '유/酉 (17:30~19:29)' },
  { value: 'sul',    label: '술/戌 (19:30~21:29)' },
  { value: 'hae',    label: '해/亥 (21:30~23:29)' },
  { value: 'ja_pm',  label: '야자/夜子 (23:30~23:59)' },
]

export default function TimeSelect({ value, onChange, disabled }){
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(() => Math.max(0, OPTIONS.findIndex(o=>o.value===value)))
  const wrapRef = useRef(null)
  const listRef = useRef(null)

  useEffect(()=>{
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  useEffect(()=>{
    const el = listRef.current?.querySelector(`[data-idx="${idx}"]`)
    if (open && el) el.scrollIntoView({ block:'nearest' })
  }, [open, idx])

  const current = OPTIONS[idx] || OPTIONS[0]

  const onKey = (e) => {
    if (!open) return
    if (e.key === 'ArrowDown'){ setIdx(i=>Math.min(OPTIONS.length-1, i+1)); e.preventDefault() }
    else if (e.key === 'ArrowUp'){ setIdx(i=>Math.max(0, i-1)); e.preventDefault() }
    else if (e.key === 'Enter'){ onChange(OPTIONS[idx].value); setOpen(false); e.preventDefault() }
    else if (e.key === 'Escape'){ setOpen(false); e.preventDefault() }
  }

  useEffect(()=>{
    const v = value ?? 'unknown'
    const i = OPTIONS.findIndex(o=>o.value===v)
    if (i >= 0) setIdx(i)
  }, [value])

  return (
    <div className="select-wrap" ref={wrapRef} onKeyDown={onKey}>
      <button type="button" className="select-btn" onClick={()=>!disabled && setOpen(v=>!v)} aria-expanded={open} disabled={disabled}>
        <span>{(OPTIONS.find(o=>o.value===value)||OPTIONS[0]).label}</span>
        <span className="caret" />
      </button>
      {open && !disabled && (
        <div className="menu" role="listbox" tabIndex={-1} ref={listRef}>
          <div className="menu-section">태어난 시간</div>
          {OPTIONS.map((o,i) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value===value}
              className={`menu-item ${o.value===value ? 'active':''}`}
              data-idx={i}
              onMouseEnter={()=>setIdx(i)}
              onClick={()=>{ onChange(o.value); setOpen(false) }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
