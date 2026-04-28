import type { Member, SignupRequest } from '../types/member'

async function parseError(response: Response, fallbackMessage: string) {
  const error = await response.json().catch(() => null)
  return new Error(error?.message ?? fallbackMessage)
}

export async function signup(member: SignupRequest) {
  const response = await fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(member),
  })

  if (!response.ok) {
    throw await parseError(response, '회원가입에 실패했습니다.')
  }

  return (await response.json()) as Member
}
