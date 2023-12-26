export interface Message {
  date: { seconds: number; nanoseconds: number }
  id: string
  senderId: string
  text?: string
  image?: File
  file?: File
}

interface File {
  name: string
  size: number
  url: string
}
