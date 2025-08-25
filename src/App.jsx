import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="container">
      <header>
        <Link to="/" className="brand">
          <span className="brand-mark" />
          <span className="brand-title">GY_Fortune</span>
        </Link>
        <nav>
          <a href="#" onClick={(e)=>e.preventDefault()}>가이드</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>문의</a>
        </nav>
      </header>
      <Outlet />
      <footer>
        © {new Date().getFullYear()} GY_Fortune · Inspired by modern fortune UI
      </footer>
    </div>
  )
}
