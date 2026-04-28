import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteGroup,
  getGroup,
  joinGroup,
  updateGroupStatus,
} from '../api/groups'
import { getGroupPosts } from '../api/posts'
import type { Group, GroupStatus } from '../types/group'
import type { Post } from '../types/post'

export function GroupDetailPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!groupId) return

    let ignore = false

    const loadGroup = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [nextGroup, nextPosts] = await Promise.all([
          getGroup(groupId),
          getGroupPosts(groupId),
        ])
        if (!ignore) {
          setGroup(nextGroup)
          setPosts(nextPosts)
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '그룹 정보를 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadGroup()

    return () => {
      ignore = true
    }
  }, [groupId])

  const reloadGroup = async () => {
    if (!groupId) return
    setGroup(await getGroup(groupId))
  }

  const handleJoin = async () => {
    if (!group) return
    setErrorMessage('')
    setMessage('')

    try {
      await joinGroup(group.groupId)
      setMessage('그룹에 참여했습니다.')
      await reloadGroup()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '그룹에 참여하지 못했습니다.',
      )
    }
  }

  const handleStatusChange = async (status: GroupStatus) => {
    if (!group) return
    setErrorMessage('')
    setMessage('')

    try {
      await updateGroupStatus(group.groupId, status)
      setMessage('그룹 상태를 변경했습니다.')
      await reloadGroup()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '그룹 상태를 변경하지 못했습니다.',
      )
    }
  }

  const handleDelete = async () => {
    if (!group) return
    const confirmed = window.confirm(
      '그룹을 삭제하면 되돌릴 수 없습니다. 삭제하시겠습니까?',
    )
    if (!confirmed) return

    setErrorMessage('')
    setMessage('')

    try {
      await deleteGroup(group.groupId)
      navigate('/groups')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '그룹을 삭제하지 못했습니다.',
      )
    }
  }

  return (
    <section className="detail-section">
      <Link className="back-link" to="/groups">
        &lt; 그룹 목록으로
      </Link>

      {isLoading && <p className="state-message">그룹 정보를 불러오는 중입니다.</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {message && <p className="success-message">{message}</p>}

      {group && (
        <>
          <div className="detail-header">
            <div>
              <p className="eyebrow">Group detail</p>
              <h1>{group.title}</h1>
              <p className="meta">
                {group.participantCount} / {group.maxMember}명 참여 중 · 마감{' '}
                {formatDateTime(group.expiresAt)}
              </p>
            </div>
            <span className={`status-badge ${group.status.toLowerCase()}`}>
              {group.status}
            </span>
          </div>

          <div className="detail-panel">
            <h2>설명</h2>
            <p>{group.description}</p>
          </div>

          <div className="actions">
            {group.status === 'OPEN' && (
              <button type="button" onClick={handleJoin}>
                참여하기
              </button>
            )}
            <Link className="primary-link" to={`/groups/${group.groupId}/posts/new`}>
              게시글 올리기
            </Link>
          </div>

          <div className="detail-panel">
            <div className="panel-header">
              <h2>게시글</h2>
              <Link className="secondary-link" to={`/groups/${group.groupId}/posts/new`}>
                게시글 올리기
              </Link>
            </div>
            {posts.length === 0 ? (
              <p className="state-message">이 그룹에 등록된 게시글이 없습니다.</p>
            ) : (
              <div className="item-list compact-list">
                {posts.map((post) => (
                  <article className="item-card post-card" key={post.id}>
                    {post.imageUrl && (
                      <img className="post-thumb" src={post.imageUrl} alt="" />
                    )}
                    <div className="item-card-body">
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                      <p className="meta">
                        이미지 {post.imageUrl ? '있음' : '없음'} ·{' '}
                        {formatDateTime(post.createdAt)}
                      </p>
                    </div>
                    <div className="card-actions">
                      <Link
                        className="secondary-link"
                        to={`/groups/${group.groupId}/posts/${post.id}`}
                      >
                        자세히
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="detail-panel">
            <h2>호스트 관리</h2>
            <p className="meta">
              수정, 마감, 삭제 권한은 백엔드에서 호스트 여부를 기준으로 확인합니다.
            </p>
            <div className="actions">
              <Link className="secondary-link" to={`/groups/${group.groupId}/edit`}>
                그룹 수정
              </Link>
              <button type="button" onClick={() => handleStatusChange('CLOSED')}>
                마감 처리
              </button>
              <button type="button" onClick={() => handleStatusChange('OPEN')}>
                오픈 처리
              </button>
              <button className="danger-button" type="button" onClick={handleDelete}>
                그룹 삭제
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

function formatDateTime(value: string) {
  return value.replace('T', ' ').slice(0, 16)
}
