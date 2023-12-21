export interface Message {
  date: { seconds: number; nanoseconds: number }
  id: string
  senderId: string
  text: string
}
