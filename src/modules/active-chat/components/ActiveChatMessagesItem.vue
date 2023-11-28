<script setup lang="ts">
interface Props {
  message: { text: string; isOwner: boolean }
}
defineProps<Props>()
</script>

<template>
  <v-card
    class="active-chat-message mb-1 pa-2"
    :color="message.isOwner ? 'primary' : 'default'"
    :class="{ owner: message.isOwner }"
  >
    {{ message.text }}
  </v-card>
</template>

<style lang="scss" scoped>
.active-chat-message {
  width: max-content;
  max-width: 50%;
  border-radius: 15px 15px 15px 0;
  &.owner {
    margin-left: auto;
    border-radius: 15px 15px 0 15px;
  }
}
</style>
