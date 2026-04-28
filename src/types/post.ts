export type Post = {
  id: number
  hostId: number
  title: string
  content: string
  imageUrl: string | null
  createdAt: string
}

export type PostRequest = {
  title: string
  content: string
}
