import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGroups, joinGroup } from '../api/groups'
import type { Group } from '../types/group'

type GroupFilter = 'all' | 'open' | 'available'

const filterLabels: Record<GroupFilter, string> = {
  all: '전체',
  open: '오픈',
  available: '참여 가능',
}

export function GroupsPage() {
  const [filter, setFilter] = useState<GroupFilter>('available')
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false

    const loadGroups = async () => {
      setIsLoading(true)
      setErrorMessage('')
      setMessage('')

      try {
        const nextGroups = await getGroups(filter)
        if (!ignore) setGroups(nextGroups)
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '그룹 목록을 불러오지 못했습니다.',
          )
        }
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadGroups()

    return () => {
      ignore = true
    }
  }, [filter])

  const handleJoin = async (groupId: number) => {
    setErrorMessage('')
    setMessage('')

    try {
      await joinGroup(groupId)
      setMessage('그룹에 참여했습니다.')
      setGroups(await getGroups(filter))
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '그룹에 참여하지 못했습니다.',
      )
    }
  }

  return (
    <section className="list-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Groups</p>
          <h1>그룹</h1>
          <p className="lead">
            참여 가능한 공동구매 그룹을 확인하고 새 그룹을 만들 수 있습니다.
          </p>
        </div>
        <Link className="primary-link" to="/groups/new">
          그룹 만들기
        </Link>
      </div>

      <div className="toolbar" role="group" aria-label="그룹 필터">
        {(Object.keys(filterLabels) as GroupFilter[]).map((key) => (
          <button
            className={filter === key ? 'is-active' : ''}
            key={key}
            type="button"
            onClick={() => setFilter(key)}
          >
            {filterLabels[key]}
          </button>
        ))}
      </div>

      {message && <p className="success-message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {isLoading && <p className="state-message">그룹을 불러오는 중입니다.</p>}
      {!isLoading && groups.length === 0 && (
        <p className="state-message">표시할 그룹이 없습니다.</p>
      )}

      <div className="item-list">
        {groups.map((group) => (
          <article className="item-card" key={group.groupId}>
            <div>
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
              {group.status === 'OPEN' && (
                <button type="button" onClick={() => handleJoin(group.groupId)}>
                  참여하기
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatDateTime(value: string) {
  return value.replace('T', ' ').slice(0, 16)
}
