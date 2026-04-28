import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createPost,
  deletePostImage,
  getPost,
  updatePost,
  uploadPostImage,
} from '../api/posts'

type PostFormPageProps = {
  mode: 'create' | 'edit'
}

export function PostFormPage({ mode }: PostFormPageProps) {
  const { groupId, postId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false)
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (mode !== 'edit' || !groupId || !postId) return

    let ignore = false

    const loadPost = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const post = await getPost(groupId, postId)
        if (ignore) return
        setTitle(post.title)
        setContent(post.content)
        setCurrentImageUrl(post.imageUrl)
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
  }, [groupId, mode, postId])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!groupId) return

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const savedPost =
        mode === 'create'
          ? await createPost(groupId, { title, content })
          : await updatePost(groupId, String(postId), { title, content })

      if (mode === 'edit' && shouldDeleteImage && !imageFile) {
        await deletePostImage(String(savedPost.id))
      }

      if (imageFile) {
        await uploadPostImage(savedPost.id, imageFile)
      }

      navigate(`/groups/${groupId}/posts/${savedPost.id}`)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '게시글 저장에 실패했습니다.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    if (file) setShouldDeleteImage(false)
  }

  return (
    <section className="form-section">
      <Link className="back-link" to={groupId ? `/groups/${groupId}` : '/board'}>
        &lt; 게시판으로
      </Link>

      <form className="feature-form" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Posts</p>
          <h1>{mode === 'create' ? '게시글 올리기' : '게시글 수정'}</h1>
          <p className="form-description">
            제목, 내용, 이미지를 입력해 그룹 게시글을 관리합니다.
          </p>
        </div>

        {isLoading ? (
          <p className="state-message">게시글을 불러오는 중입니다.</p>
        ) : (
          <>
            <label>
              제목
              <input
                maxLength={100}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="공지 제목"
                required
              />
            </label>

            <label>
              내용
              <textarea
                maxLength={500}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="게시글 내용을 입력하세요."
                required
              />
            </label>

            {currentImageUrl && !shouldDeleteImage && (
              <div className="current-image">
                <p className="meta">현재 이미지</p>
                <img src={currentImageUrl} alt="" />
              </div>
            )}

            <label>
              이미지
              <input
                accept="image/*"
                type="file"
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0] ?? null)
                }
              />
            </label>

            {currentImageUrl && (
              <label className="checkbox-label">
                <input
                  checked={shouldDeleteImage}
                  type="checkbox"
                  onChange={(event) => setShouldDeleteImage(event.target.checked)}
                />
                현재 이미지 삭제
              </label>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="form-actions">
              <Link
                className="secondary-link"
                to={
                  mode === 'edit' && groupId && postId
                    ? `/groups/${groupId}/posts/${postId}`
                    : groupId
                      ? `/groups/${groupId}`
                      : '/board'
                }
              >
                취소
              </Link>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? '저장 중...'
                  : mode === 'create'
                    ? '등록하기'
                    : '수정 완료'}
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  )
}
