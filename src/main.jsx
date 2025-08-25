import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Result from './pages/Result.jsx'
import './index.css'

// 좌/우클릭/드래그 방지 토글
(function(){
  let enabled = JSON.parse(localStorage.getItem('protect') || 'true')
  const onContext = (e)=> enabled && e.preventDefault()
  const onSelect = (e)=> {
    if (!enabled) return
    const tag = (e.target.tagName||'').toLowerCase()
    if (['input','textarea','select','button','a','label'].includes(tag)) return
    e.preventDefault()
  }
  const onMouseDown = (e)=> {
    if (!enabled) return
    const tag = (e.target.tagName||'').toLowerCase()
    if (['input','textarea','select','button','a','label'].includes(tag)) return
    if (e.button===0) e.preventDefault()
  }
  const onDrag = (e)=> enabled && e.preventDefault()

  window.__applyGuards = function(){
    window.addEventListener('contextmenu', onContext)
    window.addEventListener('selectstart', onSelect)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('dragstart', onDrag)
  }
  window.__removeGuards = function(){
    window.removeEventListener('contextmenu', onContext)
    window.removeEventListener('selectstart', onSelect)
    window.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('dragstart', onDrag)
  }
  window.__toggleProtect = function(){
    enabled = !enabled
    localStorage.setItem('protect', JSON.stringify(enabled))
    if (enabled) window.__applyGuards(); else window.__removeGuards();
    alert('보호 모드: ' + (enabled ? '켜짐' : '꺼짐'))
  }
  if (enabled) window.__applyGuards()
})()


// 우클릭 방지
window.addEventListener('contextmenu', (e) => e.preventDefault())

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'result', element: <Result /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


// 좌클릭 드래그/선택 방지(입력 컨트롤 제외)
window.addEventListener('selectstart', (e) => {
  const t = e.target
  if (!t) return
  const tag = (t.tagName || '').toLowerCase()
  if (['input','textarea','select'].includes(tag)) return
  e.preventDefault()
})
window.addEventListener('dragstart', (e) => e.preventDefault())
window.addEventListener('mousedown', (e) => {
  const t = e.target
  const tag = (t && t.tagName || '').toLowerCase()
  if (['input','textarea','select','button','a','label'].includes(tag)) return
  if (e.button === 0) e.preventDefault()
})
