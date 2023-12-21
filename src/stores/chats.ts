import type { Chat } from '@/types/chat'
import { defineStore } from 'pinia'

interface State {
  activeChat: Chat | null
}

export const useChatsStore = defineStore('chats', {
  state: (): State => ({
    activeChat: null
  }),
  actions: {
    setActiveChat(chat: Chat | null) {
      this.activeChat = chat
    }
  }
})
