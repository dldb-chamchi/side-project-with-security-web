import { type FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMyComments,
  getMyEmail,
  getMyGroups,
  getMyHostGroups,
  getMyName,
  getMyPosts,
  updateMyEmail,
  updateMyName,
} from '../api/mypage'
import type { AuthUser } from '../types/auth'
import type { Comment } from '../types/comment'
import type { Group } from '../types/group'
import type { Post } from '../types/post'

type MyPageProps = {
  user: AuthUser
  onEmailChange: (email: string) => void
}

type MyPageTab = 'profile' | 'joinedGroups' | 'hostGroups' | 'posts' | 'comments'

const tabs: Array<{ id: MyPageTab; label: string }> = [
  { id: 'profile', label: '내 정보' },
  { id: 'joinedGroups', label: '가입한 그룹' },
  { id: 'hostGroups', label: '내가 만든 그룹' },
  { id: 'posts', label: '내 게시글' },
  { id: 'comments', label: '내 댓글' },
]

export function MyPage({ user, onEmailChange }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<MyPageTab>('profile')
  const [myEmail, setMyEmail] = useState(user.email)
  const [myName, setMyName] = useState('')
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([])
  const [hostGroups, setHostGroups] = useState<Group[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false

    const loadMyPage = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [
          nextEmail,
          nextName,
          nextJoinedGroups,
          nextHostGroups,
          nextPosts,
          nextComments,
        ] =
          await Promise.all([
            getMyEmail(),
            getMyName(),
            getMyGroups(),
            getMyHostGroups(),
            getMyPosts(),
            getMyComments(),
          ])

        if (ignore) return
        setMyEmail(nextEmail.email)
        setMyName(nextName.name)
        setJoinedGroups(nextJoinedGroups)
        setHostGroups(nextHostGroups)
        setPosts(nextPosts)
        setComments(nextComments)
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '마이페이지 정보를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadMyPage()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="list-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">My page</p>
          <h1>마이페이지</h1>
          <p className="lead">{user.email}님의 활동 내역입니다.</p>
        </div>
      </div>

      <div className="tabs" role="tablist" aria-label="마이페이지 메뉴">
        {tabs.map((tab) => (
          <button
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'is-active' : ''}
            key={tab.id}
            role="tab"
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading ? (
        <p className="state-message">마이페이지 정보를 불러오는 중입니다.</p>
      ) : (
        <div className="tab-panel" role="tabpanel">
          {activeTab === 'profile' && (
            <ProfilePanel
              email={myEmail}
              name={myName}
              onEmailChange={(email) => {
                setMyEmail(email)
                onEmailChange(email)
              }}
              onNameChange={setMyName}
            />
          )}
          {activeTab === 'joinedGroups' && <GroupList groups={joinedGroups} />}
          {activeTab === 'hostGroups' && (
            <GroupList groups={hostGroups} showEditLink />
          )}
          {activeTab === 'posts' && <PostList posts={posts} />}
          {activeTab === 'comments' && <CommentList comments={comments} />}
        </div>
      )}
    </section>
  )
}

function ProfilePanel({
  email,
  name,
  onEmailChange,
  onNameChange,
}: {
  email: string
  name: string
  onEmailChange: (email: string) => void
  onNameChange: (name: string) => void
}) {
  const [newEmail, setNewEmail] = useState(email)
  const [emailPassword, setEmailPassword] = useState('')
  const [newName, setNewName] = useState(name)
  const [namePassword, setNamePassword] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [nameMessage, setNameMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [nameError, setNameError] = useState('')
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)
  const [isNameSubmitting, setIsNameSubmitting] = useState(false)

  useEffect(() => {
    setNewEmail(email)
  }, [email])

  useEffect(() => {
    setNewName(name)
  }, [name])

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailMessage('')
    setEmailError('')
    setIsEmailSubmitting(true)

    try {
      const response = await updateMyEmail({
        email: newEmail,
        password: emailPassword,
      })
      onEmailChange(response.email)
      setEmailPassword('')
      setEmailMessage('이메일을 변경했습니다.')
    } catch (error) {
      setEmailError(
        error instanceof Error ? error.message : '이메일을 변경하지 못했습니다.',
      )
    } finally {
      setIsEmailSubmitting(false)
    }
  }

  const handleNameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNameMessage('')
    setNameError('')
    setIsNameSubmitting(true)

    try {
      const response = await updateMyName({
        name: newName,
        password: namePassword,
      })
      onNameChange(response.name)
      setNamePassword('')
      setNameMessage('이름을 변경했습니다.')
    } catch (error) {
      setNameError(
        error instanceof Error ? error.message : '이름을 변경하지 못했습니다.',
      )
    } finally {
      setIsNameSubmitting(false)
    }
  }

  return (
    <div className="profile-grid">
      <form className="detail-panel profile-card" onSubmit={handleEmailSubmit}>
        <div>
          <h2>이메일</h2>
          <p className="meta">현재 이메일</p>
          <p className="profile-value">{email}</p>
        </div>

        <label>
          새 이메일
          <input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            required
          />
        </label>

        <label>
          현재 비밀번호
          <input
            type="password"
            value={emailPassword}
            onChange={(event) => setEmailPassword(event.target.value)}
            required
          />
        </label>

        {emailError && <p className="error-message">{emailError}</p>}
        {emailMessage && <p className="success-message">{emailMessage}</p>}

        <button type="submit" disabled={isEmailSubmitting}>
          {isEmailSubmitting ? '변경 중...' : '이메일 변경'}
        </button>
      </form>

      <form className="detail-panel profile-card" onSubmit={handleNameSubmit}>
        <div>
          <h2>이름</h2>
          <p className="meta">현재 이름</p>
          <p className="profile-value">{name || '이름을 불러오는 중입니다.'}</p>
        </div>

        <label>
          새 이름
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            required
          />
        </label>

        <label>
          현재 비밀번호
          <input
            type="password"
            value={namePassword}
            onChange={(event) => setNamePassword(event.target.value)}
            required
          />
        </label>

        {nameError && <p className="error-message">{nameError}</p>}
        {nameMessage && <p className="success-message">{nameMessage}</p>}

        <button type="submit" disabled={isNameSubmitting}>
          {isNameSubmitting ? '변경 중...' : '이름 변경'}
        </button>
      </form>
    </div>
  )
}

function GroupList({
  groups,
  showEditLink = false,
}: {
  groups: Group[]
  showEditLink?: boolean
}) {
  if (groups.length === 0) {
    return <p className="state-message">표시할 그룹이 없습니다.</p>
  }

  return (
    <div className="item-list">
      {groups.map((group) => (
        <article className="item-card" key={group.groupId}>
          <div className="item-card-body">
            <div className="item-card-header">
              <h2>{group.title}</h2>
              <span className={`status-badge ${group.status.toLowerCase()}`}>
                {group.status}
              </span>
            </div>
            <p>{group.description}</p>
            <p className="meta">
              {group.participantCount} / {group.maxMember}명 · 마감{' '}
              {formatDateTime(group.expiresAt)}
            </p>
          </div>
          <div className="card-actions">
            <Link className="secondary-link" to={`/groups/${group.groupId}`}>
              상세보기
            </Link>
            {showEditLink && (
              <Link
                className="secondary-link"
                to={`/groups/${group.groupId}/edit`}
              >
                그룹 수정
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="state-message">표시할 게시글이 없습니다.</p>
  }

  return (
    <>
      <p className="state-message">
        현재 게시글 응답에는 그룹 ID가 없어 상세 화면 이동 없이 목록만
        표시합니다.
      </p>
      <div className="item-list">
        {posts.map((post) => (
          <article className="item-card post-card" key={post.id}>
            {post.imageUrl && (
              <img className="post-thumb" src={post.imageUrl} alt="" />
            )}
            <div className="item-card-body">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p className="meta">
                이미지 {post.imageUrl ? '있음' : '없음'} ·{' '}
                {formatDateTime(post.createdAt)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <p className="state-message">표시할 댓글이 없습니다.</p>
  }

  return (
    <>
      <p className="state-message">
        현재 댓글 응답에는 게시글 ID가 없어 댓글이 달린 게시글 이동 없이
        목록만 표시합니다.
      </p>
      <div className="item-list">
        {comments.map((comment) => (
          <article className="item-card" key={comment.commentId}>
            <div className="item-card-body">
              <h2>댓글 #{comment.commentId}</h2>
              <p>{comment.content}</p>
              <p className="meta">작성일 {formatDateTime(comment.createdAt)}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function formatDateTime(value: string) {
  return value.replace('T', ' ').slice(0, 16)
}
