import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import type { AuthUser } from '../types/auth'

type HeaderProps = {
  user: AuthUser | null
  onLogoutSuccess: () => void
}

export function Header({ user, onLogoutSuccess }: HeaderProps) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setErrorMessage('')
    setIsLoggingOut(true)

    try {
      await logout()
      onLogoutSuccess()
      navigate('/login')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '로그아웃에 실패했습니다.',
      )
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="app-header">
      <Link className="brand" to="/">
        공동구매 보안 웹
      </Link>

      <nav className="nav" aria-label="주요 메뉴">
        {user && <Link to="/groups">그룹</Link>}
        <Link to="/board">게시판</Link>
        {user ? (
          <>
            <Link to="/mypage">마이페이지</Link>
            <button type="button" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? '처리 중...' : '로그아웃'}
            </button>
          </>
        ) : (
          <Link to="/login">로그인</Link>
        )}
      </nav>
      {errorMessage && <p className="header-error">{errorMessage}</p>}
    </header>
  )
}
