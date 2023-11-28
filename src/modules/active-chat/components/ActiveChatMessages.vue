<script setup lang="ts">
import ActiveChatMessagesItem from './ActiveChatMessagesItem.vue'

const messages = [
  { text: 'Lorem, ipsum.', isOwner: false },
  { text: 'Lorem, ipsum.', isOwner: true },
  { text: 'Lorem ipsum dolor sit amet.', isOwner: false },
  { text: 'Lorem ipsum dolor sit amet.', isOwner: true },
  {
    text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non obcaecati dolorum nobis hic deserunt libero reiciendis, cupiditate vitae accusamus assumenda ipsum voluptate eligendi temporibus voluptatem.',
    isOwner: false
  },
  {
    text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non obcaecati dolorum nobis hic deserunt libero reiciendis, cupiditate vitae accusamus assumenda ipsum voluptate eligendi temporibus voluptatem.',
    isOwner: true
  }
]
</script>

<template>
  <div class="active-chat-messages pa-4">
    <active-chat-messages-item
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
    />
  </div>
</template>

<style lang="scss" scoped>
.active-chat-messages {
  overflow-y: auto;
  min-height: 100px;
  height: calc(100vh - 130px);
}
</style>
