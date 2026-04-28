import type { Group, GroupRequest, GroupStatus } from '../types/group'

type GroupFilter = 'all' | 'open' | 'available'

async function parseError(response: Response, fallbackMessage: string) {
  const error = await response.json().catch(() => null)
  return new Error(error?.message ?? fallbackMessage)
}

export async function getGroups(filter: GroupFilter) {
  const path = {
    all: '/api/groups',
    open: '/api/groups/open',
    available: '/api/groups/available',
  }[filter]

  const response = await fetch(path, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '그룹 목록을 불러오지 못했습니다.')
  }

  return (await response.json()) as Group[]
}

export async function getGroup(groupId: string) {
  const response = await fetch(`/api/groups/${groupId}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '그룹 정보를 불러오지 못했습니다.')
  }

  return (await response.json()) as Group
}

export async function createGroup(group: GroupRequest) {
  const response = await fetch('/api/groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(group),
  })

  if (!response.ok) {
    throw await parseError(response, '그룹을 만들지 못했습니다.')
  }

  return (await response.json()) as Group
}

export async function updateGroup(groupId: number, group: GroupRequest) {
  const response = await fetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(group),
  })

  if (!response.ok) {
    throw await parseError(response, '그룹을 수정하지 못했습니다.')
  }

  return (await response.json()) as Group
}

export async function updateGroupStatus(
  groupId: number,
  status: GroupStatus,
) {
  const response = await fetch(`/api/groups/${groupId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw await parseError(response, '그룹 상태를 변경하지 못했습니다.')
  }
}

export async function deleteGroup(groupId: number) {
  const response = await fetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '그룹을 삭제하지 못했습니다.')
  }
}

export async function joinGroup(groupId: number) {
  const response = await fetch(`/api/groups/${groupId}/participants`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw await parseError(response, '그룹에 참여하지 못했습니다.')
  }
}
