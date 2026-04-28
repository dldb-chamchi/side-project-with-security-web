import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api/members'

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await signup({ name, email, password })
      navigate('/login', {
        state: {
          message: '회원가입이 완료되었습니다. 로그인해주세요.',
          email,
        },
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '회원가입에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="login-section">
      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Sign up</p>
          <h1>회원가입</h1>
          <p className="form-description">
            계정을 만들고 공동구매 그룹에 참여해보세요.
          </p>
        </div>

        <label>
          이름
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="홍길동"
            required
          />
        </label>

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
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>

        <p className="auth-link">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </section>
  )
}
