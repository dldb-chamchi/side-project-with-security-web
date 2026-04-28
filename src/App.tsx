import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { BoardPage } from './pages/BoardPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MyPage } from './pages/MyPage'
import type { AuthUser } from './types/auth'
import './App.css'

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const email = sessionStorage.getItem('loginEmail')
    return email ? { email } : null
  })

  const handleLoginSuccess = (email: string) => {
    sessionStorage.setItem('loginEmail', email)
    setUser({ email })
  }

  const handleLogoutSuccess = () => {
    sessionStorage.removeItem('loginEmail')
    setUser(null)
  }

  return (
    <div className="app-shell">
      <Header user={user} onLogoutSuccess={handleLogoutSuccess} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/board" element={<BoardPage />} />
          <Route
            path="/mypage"
            element={
              user ? <MyPage user={user} /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
