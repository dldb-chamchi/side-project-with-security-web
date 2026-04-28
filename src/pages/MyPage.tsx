import type { AuthUser } from '../types/auth'

type MyPageProps = {
  user: AuthUser
}

export function MyPage({ user }: MyPageProps) {
  return (
    <section className="placeholder-section">
      <p className="eyebrow">My page</p>
      <h1>{user.email}님의 마이페이지</h1>
      <p className="lead">내 그룹, 내 게시글, 내 댓글 정보를 보여줄 자리입니다.</p>
    </section>
  )
}
