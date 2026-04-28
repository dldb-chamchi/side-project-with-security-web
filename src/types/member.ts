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
