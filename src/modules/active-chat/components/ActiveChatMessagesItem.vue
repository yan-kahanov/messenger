<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Message } from '@/types/message'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import formatBytes from '@/helpers/formatBytes'
import ImageModal from '@/components/ImageModal.vue'

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

const downloadFile = () => {
  fetch(props.message.file?.url as string)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = props.message.file?.name as string
      link.click()
    })
}

const handleClick = () => {
  if (props.message.file) {
    downloadFile()
  }
}
</script>

<template>
  <v-card
    class="active-chat-message mb-1 py-2 px-3"
    :color="isOwner ? 'primary' : 'default'"
    :class="{ owner: isOwner, clickable: message.file || message.image }"
    @click="handleClick"
  >
    <div class="pb-1">
      {{ message.text }}
    </div>
    <v-sheet v-if="message.image" color="white" class="active-chat-message__img">
      <v-img :src="message?.image.url" ref="imageEl" width="150"></v-img>
    </v-sheet>
    <image-modal v-if="message.image" :src="message.image.url" activator="parent"/>
    <div v-if="message.file" class="d-flex align-center">
      <v-avatar class="active-chat-message__file-avatar">
        <v-icon icon="mdi-file" :color="isOwner ? 'primary' : 'surface'" />
      </v-avatar>
      <div class="ms-3">
        <div>{{ message.file.name }}</div>
        <div class="text-disabled">
          {{ formatBytes(message.file.size) }}
        </div>
      </div>
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
  pointer-events: none;
  &.clickable {
    cursor: pointer;
    pointer-events: all;
  }
  &.owner {
    margin-left: auto;
    border-radius: 15px 15px 0 15px;
  }
  &__file {
    &-avatar {
      background-color: rgba(var(--v-theme-on-background));
    }
  }
}
</style>
