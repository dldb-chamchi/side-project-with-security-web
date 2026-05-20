import type { Comment } from '../types/comment'
import type { Group } from '../types/group'
import type {
  MemberEmail,
  MemberEmailUpdateRequest,
  MemberName,
  MemberNameUpdateRequest,
} from '../types/member'
import type { Post } from '../types/post'

async function parseError(response: Response, fallbackMessage: string) {
  const error = await response.json().catch(() => null)
  return new Error(error?.message ?? fallbackMessage)
}

export async function getMyGroups() {
  const response = await fetch('/api/members/me/groups', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '가입한 그룹을 불러오지 못했습니다.')
  }

  return (await response.json()) as Group[]
}

export async function getMyEmail() {
  const response = await fetch('/api/members/me/email', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '이메일을 불러오지 못했습니다.')
  }

  return (await response.json()) as MemberEmail
}

export async function updateMyEmail(request: MemberEmailUpdateRequest) {
  const response = await fetch('/api/members/me/email', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw await parseError(response, '이메일을 변경하지 못했습니다.')
  }

  return (await response.json()) as MemberEmail
}

export async function getMyName() {
  const response = await fetch('/api/members/me/name', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '이름을 불러오지 못했습니다.')
  }

  return (await response.json()) as MemberName
}

export async function updateMyName(request: MemberNameUpdateRequest) {
  const response = await fetch('/api/members/me/name', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw await parseError(response, '이름을 변경하지 못했습니다.')
  }

  return (await response.json()) as MemberName
}

export async function getMyHostGroups() {
  const response = await fetch('/api/members/me/groups/host', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '내가 만든 그룹을 불러오지 못했습니다.')
  }

  return (await response.json()) as Group[]
}

export async function getMyPosts() {
  const response = await fetch('/api/members/me/posts', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '내 게시글을 불러오지 못했습니다.')
  }

  return (await response.json()) as Post[]
}

export async function getMyComments() {
  const response = await fetch('/api/members/me/comments', {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '내 댓글을 불러오지 못했습니다.')
  }

  return (await response.json()) as Comment[]
}
