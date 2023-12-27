<script setup lang="ts">
import { ref, computed, watchEffect, inject } from 'vue'
import ActiveChatMessagesItem from './ActiveChatMessagesItem.vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, onSnapshot, type Firestore } from 'firebase/firestore'
import { type Message } from '@/types/message'
import { nextTick } from 'vue'
import { useTheme } from 'vuetify'

const messages = ref<Message[]>([])
const isLoading = ref(true)
const fbDB = inject<Firestore>('fbDB')
const route = useRoute()
const router = useRouter()
const chatUid = computed(() => route.query.chat)
const innerEl = ref()
const theme = useTheme()
const isDarkTheme = computed(() => theme.global.name.value === 'dark')

watchEffect(() => {
  if (!fbDB || !chatUid.value) return
  isLoading.value = true

  onSnapshot(doc(fbDB, 'chats', chatUid.value as string), (doc) => {
    if (doc.exists()) {
      messages.value = doc.data().messages
      scrollToBottom()
    } else {
      router.replace('/')
    }
    isLoading.value = false
  })
})

const scrollToBottom = () => {
  nextTick(() => {
    innerEl.value.scrollTop = innerEl.value.scrollHeight
  })
}
</script>

<template>
  <div class="active-chat-messages" :class="{ dark: isDarkTheme }">
    <div class="active-chat-messages__inner pa-4" ref="innerEl">
      <div v-if="isLoading" class="h-100 d-flex align-center justify-center">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else-if="!messages?.length" class="d-flex justify-center align-center h-100">
        <v-chip variant="elevated">Нет сообщений</v-chip>
      </div>
      <div v-else>
        <active-chat-messages-item
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :scroll-to-bottom="scrollToBottom"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-chat-messages {
  position: relative;
  &__inner {
    background-color: #a5d6a7;
    overflow-y: auto;
    min-height: 100px;
    height: calc(100vh - 121.2px);
    background-image: url('@/modules/active-chat/assets/chat-background.svg');
    background-repeat: repeat;
    background-attachment: fixed;
  }
  &.dark {
    .active-chat-messages__inner {
      background-color: #000;
    }
    &::before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      pointer-events: none;
    }
  }
}
</style>
