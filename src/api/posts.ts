import type { Post, PostRequest } from '../types/post'

async function parseError(response: Response, fallbackMessage: string) {
  const error = await response.json().catch(() => null)
  return new Error(error?.message ?? fallbackMessage)
}

export async function getGroupPosts(groupId: string) {
  const response = await fetch(`/api/groups/${groupId}/posts`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '게시글 목록을 불러오지 못했습니다.')
  }

  return (await response.json()) as Post[]
}

export async function getPost(groupId: string, postId: string) {
  const response = await fetch(`/api/groups/${groupId}/posts/${postId}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '게시글을 불러오지 못했습니다.')
  }

  return (await response.json()) as Post
}

export async function searchPosts(keyWord: string) {
  const params = new URLSearchParams({ keyWord })
  const response = await fetch(`/api/posts/search?${params.toString()}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '게시글을 검색하지 못했습니다.')
  }

  return (await response.json()) as Post[]
}

export async function createPost(groupId: string, post: PostRequest) {
  const response = await fetch(`/api/groups/${groupId}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw await parseError(response, '게시글을 등록하지 못했습니다.')
  }

  return (await response.json()) as Post
}

export async function updatePost(
  groupId: string,
  postId: string,
  post: PostRequest,
) {
  const response = await fetch(`/api/groups/${groupId}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw await parseError(response, '게시글을 수정하지 못했습니다.')
  }

  return (await response.json()) as Post
}

export async function deletePost(groupId: string, postId: string) {
  const response = await fetch(`/api/groups/${groupId}/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '게시글을 삭제하지 못했습니다.')
  }
}

export async function uploadPostImage(postId: number, image: File) {
  const formData = new FormData()
  formData.append('image', image)

  const response = await fetch(`/api/posts/${postId}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!response.ok) {
    throw await parseError(response, '이미지를 업로드하지 못했습니다.')
  }
}

export async function deletePostImage(postId: string) {
  const response = await fetch(`/api/posts/${postId}/image`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '이미지를 삭제하지 못했습니다.')
  }
}
