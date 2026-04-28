import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

type LoginPageProps = {
  onLoginSuccess: (email: string) => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      onLoginSuccess(email)
      navigate('/')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '로그인에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-section">
      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Sign in</p>
          <h1>로그인</h1>
          <p className="form-description">
            이메일과 비밀번호를 입력해 서비스를 시작하세요.
          </p>
        </div>

        <label>
          이메일
          <input
            type="email"
            value={email}
            placeholder="user@example.com"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </section>
  )
}
