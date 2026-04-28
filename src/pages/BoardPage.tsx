import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGroupPosts, searchPosts } from '../api/posts'
import type { Post } from '../types/post'

type BoardMode = 'group' | 'search'

export function BoardPage() {
  const [groupId, setGroupId] = useState('')
  const [keyWord, setKeyWord] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [mode, setMode] = useState<BoardMode>('group')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLoadGroupPosts = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!groupId.trim()) return

    setMode('group')
    setIsLoading(true)
    setErrorMessage('')

    try {
      setPosts(await getGroupPosts(groupId.trim()))
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '게시글 목록을 불러오지 못했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!keyWord.trim()) return

    setMode('search')
    setIsLoading(true)
    setErrorMessage('')

    try {
      setPosts(await searchPosts(keyWord.trim()))
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '게시글을 검색하지 못했습니다.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setKeyWord('')
    setPosts([])
    setErrorMessage('')
    setMode('group')
  }

  return (
    <section className="list-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Board</p>
          <h1>게시판</h1>
          <p className="lead">
            게시글을 제목으로 검색하거나 그룹 ID로 그룹 게시글을 조회합니다.
          </p>
        </div>
        {groupId.trim() && (
          <Link className="primary-link" to={`/groups/${groupId.trim()}/posts/new`}>
            게시글 올리기
          </Link>
        )}
      </div>

      <form className="inline-form" onSubmit={handleSearch}>
        <label>
          게시글 검색
          <input
            value={keyWord}
            onChange={(event) => setKeyWord(event.target.value)}
            placeholder="예) 공지, 배송, 모집"
          />
        </label>
        <button type="submit">검색</button>
        <button type="button" onClick={handleReset}>
          초기화
        </button>
      </form>

      <form className="inline-form" onSubmit={handleLoadGroupPosts}>
        <label>
          현재 그룹 ID
          <input
            inputMode="numeric"
            value={groupId}
            onChange={(event) => setGroupId(event.target.value)}
            placeholder="1"
          />
        </label>
        <button type="submit">조회</button>
      </form>

      {mode === 'search' && (
        <p className="state-message">
          검색 결과에는 백엔드 응답에 그룹 ID가 포함되지 않아 제목, 내용,
          이미지만 표시합니다. 수정과 삭제는 그룹 게시글 조회 또는 그룹 상세에서
          진행해주세요.
        </p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading && <p className="state-message">게시글을 불러오는 중입니다.</p>}
      {!isLoading && posts.length === 0 && (
        <p className="state-message">표시할 게시글이 없습니다.</p>
      )}

      <div className="item-list">
        {posts.map((post) => (
          <article className="item-card post-card" key={post.id}>
            {post.imageUrl && (
              <img className="post-thumb" src={post.imageUrl} alt="" />
            )}
            <div className="item-card-body">
              <div className="item-card-header">
                <h2>{post.title}</h2>
              </div>
              <p>{post.content}</p>
              <p className="meta">
                이미지 {post.imageUrl ? '있음' : '없음'} ·{' '}
                {formatDateTime(post.createdAt)}
              </p>
            </div>
            {mode === 'group' && groupId.trim() && (
              <div className="card-actions">
                <Link
                  className="secondary-link"
                  to={`/groups/${groupId.trim()}/posts/${post.id}`}
                >
                  자세히
                </Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function formatDateTime(value: string) {
  return value.replace('T', ' ').slice(0, 16)
}
