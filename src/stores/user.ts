import type { User } from '@firebase/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {} as User | null
  }),
  actions: {
    setUser(user: User | null){
      this.user = user
    }
  }
})
