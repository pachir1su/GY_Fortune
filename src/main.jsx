import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Result from './pages/Result.jsx'
import './index.css'

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
