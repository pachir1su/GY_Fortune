import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="container">
      <header>
      <a className="brand" href="/">
        <div className="brand-mark"></div>
        <div className="brand-title">GY_Fortune</div>
      </a>
      <nav>
        <a href="/guide">가이드</a>
        <a href="/about">문의</a>
        <a href="#" id="protectToggle" onClick={(e)=>{e.preventDefault(); window.__toggleProtect && window.__toggleProtect()}}>보호 모드</a>
      </nav>
    </header>
      <Outlet />
      <footer>
        © {new Date().getFullYear()} GY_Fortune · Inspired by modern fortune UI
      </footer>
    </div>
  )
}
