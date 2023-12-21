export interface Chat {
  date: {
    seconds: number
    nanoseconds: number
  }
  uid: string
  userInfo: {
    displayName: string
    photoURL: string | null
    uid: string
  }
  lastMessage?: { text: string, senderId: string }
}
