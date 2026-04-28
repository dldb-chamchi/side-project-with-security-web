import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createGroup, getGroup, updateGroup } from '../api/groups'

type GroupFormPageProps = {
  mode: 'create' | 'edit'
}

export function GroupFormPage({ mode }: GroupFormPageProps) {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [maxMember, setMaxMember] = useState(10)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mode !== 'edit' || !groupId) return

    let ignore = false

    const loadGroup = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const group = await getGroup(groupId)
        if (ignore) return
        setTitle(group.title)
        setDescription(group.description)
        setExpiresAt(group.expiresAt.slice(0, 16))
        setMaxMember(group.maxMember)
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
  }, [groupId, mode])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const request = {
      title,
      description,
      expiresAt: normalizeDateTime(expiresAt),
      maxMember,
    }

    try {
      const savedGroup =
        mode === 'create'
          ? await createGroup(request)
          : await updateGroup(Number(groupId), request)
      navigate(`/groups/${savedGroup.groupId}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '그룹 저장에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-section">
      <Link className="back-link" to={groupId ? `/groups/${groupId}` : '/groups'}>
        &lt; 그룹 목록으로
      </Link>

      <form className="feature-form" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Groups</p>
          <h1>{mode === 'create' ? '그룹 만들기' : '그룹 수정'}</h1>
          <p className="form-description">
            {mode === 'create'
              ? '새 공동구매 그룹을 만들면 내가 호스트가 됩니다.'
              : '그룹 제목, 설명, 마감 일시와 모집 인원을 수정합니다.'}
          </p>
        </div>

        {isLoading ? (
          <p className="state-message">그룹 정보를 불러오는 중입니다.</p>
        ) : (
          <>
            <label>
              제목
              <input
                maxLength={100}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="공동구매 모집"
                required
              />
            </label>

            <label>
              설명
              <textarea
                maxLength={500}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="어떤 공동구매인지 설명을 입력하세요."
                required
              />
            </label>

            <label>
              마감 일시
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                required
              />
            </label>

            <label>
              모집 인원
              <input
                max={100}
                min={2}
                type="number"
                value={maxMember}
                onChange={(event) => setMaxMember(Number(event.target.value))}
                required
              />
            </label>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="form-actions">
              <Link
                className="secondary-link"
                to={groupId ? `/groups/${groupId}` : '/groups'}
              >
                취소
              </Link>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? '저장 중...'
                  : mode === 'create'
                    ? '만들기'
                    : '수정 완료'}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  )
}

function normalizeDateTime(value: string) {
  return value.length === 16 ? `${value}:00` : value
}
