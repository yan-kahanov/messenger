<script setup lang="ts">
import { useRoute } from 'vue-router'
import ActiveChatHeader from './components/ActiveChatHeader.vue'
import ActiveChatMessages from './components/ActiveChatMessages.vue'
import ActiveChatField from './components/ActiveChatField.vue'
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import dictionary from './dictionary.json'

const route = useRoute()
const activeChatId = computed(() => route.query.chat)
const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)
</script>

<template>
  <div class="active-chat" :class="{ openedChat: !!activeChatId }">
    <div v-if="activeChatId" class="d-flex flex-column justify-space-between h-100">
      <active-chat-header />
      <active-chat-messages />
      <active-chat-field />
    </div>
    <div v-else class="d-flex justify-center align-center h-100">
      <v-chip>{{ dictionary.select_chat[lang] }}</v-chip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-chat {
  overflow: hidden;
  width: 100%;
  transition: all 0.3s;
  @media screen and (max-width: 700px) {
    width: 0;
  }
  &.openedChat {
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
}
</style>
