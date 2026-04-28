import { Link } from 'react-router-dom'
import type { AuthUser } from '../types/auth'

type HomePageProps = {
  user: AuthUser | null
}

export function HomePage({ user }: HomePageProps) {
  return (
    <section className="home-section">
      <p className="eyebrow">Welcome</p>
      <h1>
        {user
          ? `${user.email}님, 환영합니다.`
          : '로그인하고 서비스를 이용해보세요.'}
      </h1>
      <p className="lead">
        세션 로그인 기반으로 게시판과 마이페이지 기능을 연결할 예정입니다.
      </p>

      <div className="actions">
        <Link className="primary-link" to={user ? '/groups' : '/login'}>
          {user ? '그룹 보러가기' : '로그인하기'}
        </Link>
        {user && (
          <Link className="secondary-link" to="/board">
            게시판
          </Link>
        )}
      </div>
    </section>
  )
}
