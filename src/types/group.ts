export type GroupStatus = 'OPEN' | 'CLOSED'

export type Group = {
  groupId: number
  title: string
  description: string
  expiresAt: string
  maxMember: number
  status: GroupStatus
  participantCount: number
}

export type GroupRequest = {
  title: string
  description: string
  expiresAt: string
  maxMember: number
}
