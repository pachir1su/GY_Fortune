import React, { useEffect, useRef, useState } from 'react'

export default function TimeSelect({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)
  const wrapRef = useRef(null)
  const options = [
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

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const current = options.find(o => o.value === value) || options[0]

  return (
    <div className="select-wrap" ref={wrapRef}>
      <button
        ref={btnRef}
        className="select-btn"
        type="button"
        onClick={() => !disabled && setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span>{current.label}</span>
        <span className="caret" />
      </button>
      {open && !disabled && (
        <div className="menu" role="listbox" tabIndex={-1}>
          <div className="menu-section">태어난 시간</div>
          {options.map((o) => (
            <div
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`menu-item ${o.value === value ? 'active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false) }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
