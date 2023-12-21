<script setup lang="ts">
import { ref, computed, watchEffect, inject } from 'vue'
import ActiveChatMessagesItem from './ActiveChatMessagesItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, onSnapshot, type Firestore } from 'firebase/firestore'
import { type Message } from '@/types/message'
import { nextTick } from 'vue'

const messages = ref<Message[]>([])
const isLoading = ref(true)
const fbDB = inject<Firestore>('fbDB')
const route = useRoute()
const router = useRouter()
const chatUid = computed(() => route.query.chat)
const containerEl = ref()

watchEffect(() => {
  if (!fbDB || !chatUid.value) return
  isLoading.value = true

  onSnapshot(doc(fbDB, 'chats', chatUid.value as string), (doc) => {
    if (doc.exists()) {
      messages.value = doc.data().messages
      nextTick(() => {
        containerEl.value.scrollTop = containerEl.value.scrollHeight
      })
    }else{
      router.replace('/')
    }
    isLoading.value = false
  })
})
</script>

<template>
  <div class="active-chat-messages pa-4" ref="containerEl">
    <div v-if="isLoading" class="h-100 d-flex align-center justify-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else-if="!messages?.length" class="d-flex justify-center align-center h-100">
      <v-chip>Нет сообщений</v-chip>
    </div>
    <div v-else>
      <active-chat-messages-item
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-chat-messages {
  overflow-y: auto;
  min-height: 100px;
  height: calc(100vh - 130px);
}
</style>
