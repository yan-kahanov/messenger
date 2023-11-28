<script setup lang="ts">
import { ChatsModule } from '@/modules/chats'
import { ActiveChatModule } from '@/modules/active-chat'
</script>

<template>
  <div class="d-flex h-100">
    <chats-module />
    <active-chat-module />
  </div>
</template>
