export type Member = {
  memberId: number
  email: string
  name: string
  createdAt: string
}

export type SignupRequest = {
  email: string
  password: string
  name: string
}

export type MemberEmail = {
  email: string
}

export type MemberName = {
  name: string
}

export type MemberEmailUpdateRequest = {
  email: string
  password: string
}

export type MemberNameUpdateRequest = {
  name: string
  password: string
}
