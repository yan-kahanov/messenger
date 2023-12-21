<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Message } from '@/types/message'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

interface Props {
  message: Message
}
const props = defineProps<Props>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isOwner = computed(() => props.message.senderId === user.value?.uid)

const timestampToTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)

  const hours = date.getHours()
  const minutes = '0' + date.getMinutes()

  return hours + ':' + minutes.substr(-2)
}
</script>

<template>
  <v-card
    class="active-chat-message mb-1 py-2 px-3"
    :color="isOwner ? 'primary' : 'default'"
    :class="{ owner: isOwner }"
  >
    <div class="pb-1">
      {{ message.text }}
    </div>
    <div class="text-caption text-disabled ms-2">
      {{ timestampToTime(message.date?.seconds) }}
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
.active-chat-message {
  width: max-content;
  max-width: 50%;
  border-radius: 15px 15px 15px 0;
  display: flex;
  align-items: flex-end;
  &.owner {
    margin-left: auto;
    border-radius: 15px 15px 0 15px;
  }
}
</style>
