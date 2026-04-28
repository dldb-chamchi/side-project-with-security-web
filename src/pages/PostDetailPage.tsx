import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost } from '../api/posts'
import type { Post } from '../types/post'

export function PostDetailPage() {
  const { groupId, postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!groupId || !postId) return

    let ignore = false

    const loadPost = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const nextPost = await getPost(groupId, postId)
        if (!ignore) setPost(nextPost)
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '게시글을 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadPost()

    return () => {
      ignore = true
    }
  }, [groupId, postId])

  const handleDelete = async () => {
    if (!groupId || !postId) return
    const confirmed = window.confirm(
      '게시글을 삭제하면 되돌릴 수 없습니다. 삭제하시겠습니까?',
    )
    if (!confirmed) return

    setErrorMessage('')

    try {
      await deletePost(groupId, postId)
      navigate(`/groups/${groupId}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '게시글을 삭제하지 못했습니다.',
      )
    }
  }

  return (
    <section className="detail-section">
      <Link className="back-link" to={groupId ? `/groups/${groupId}` : '/board'}>
        &lt; 게시판으로
      </Link>

      {isLoading && <p className="state-message">게시글을 불러오는 중입니다.</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {post && (
        <>
          <div className="detail-header">
            <div>
              <p className="eyebrow">Post detail</p>
              <h1>{post.title}</h1>
              <p className="meta">작성일 {formatDateTime(post.createdAt)}</p>
            </div>
          </div>

          {post.imageUrl && (
            <div className="post-image-frame">
              <img src={post.imageUrl} alt="" />
            </div>
          )}

          <div className="detail-panel">
            <p className="post-content">{post.content}</p>
          </div>

          <div className="actions">
            <Link
              className="secondary-link"
              to={`/groups/${groupId}/posts/${post.id}/edit`}
            >
              수정
            </Link>
            <button className="danger-button" type="button" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </>
      )}
    </section>
  )
}

function formatDateTime(value: string) {
  return value.replace('T', ' ').slice(0, 16)
}
