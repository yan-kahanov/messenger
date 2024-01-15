<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { type Message } from '@/types/message'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import formatBytes from '@/helpers/formatBytes'
import ImageModal from '@/components/ImageModal.vue'

interface Props {
  message: Message
  scrollToBottom: () => void
}
const props = defineProps<Props>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isOwner = computed(() => props.message.senderId === user.value?.uid)
const isClickable = computed(() => props.message.file || props.message.image)
const isTransparent = computed(() => isSingleEmoji.value || props.message.image)
const emojiRegex = /\p{Extended_Pictographic}/gu
const isSingleEmoji = computed(
  () =>
    props.message?.text?.match(/./gu)?.length === 1 &&
    props.message?.text?.match(emojiRegex)?.length === 1
)

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
    :class="{
      owner: isOwner,
      clickable: isClickable,
      transparent: isTransparent
    }"
    flat
    @click="handleClick"
  >
    <div v-if="message.text" class="pb-1" :class="{ 'text-h1': isSingleEmoji }">
      {{ message.text }}
    </div>
    <v-sheet v-if="message.image" color="white" class="active-chat-message__img">
      <v-img :src="message?.image.url" ref="imageEl" width="150" @load="scrollToBottom"></v-img>
    </v-sheet>
    <image-modal v-if="message.image" :src="message.image.url" activator="parent" />
    <div v-if="message.file" class="d-flex align-center">
      <v-avatar color="white">
        <v-icon icon="mdi-file" :color="isOwner ? 'primary' : 'grey-darken-3'" />
      </v-avatar>
      <div class="ms-3">
        <div>{{ message.file.name }}</div>
        <div :style="{ opacity: '0.6' }">
          {{ formatBytes(message.file.size) }}
        </div>
      </div>
    </div>
    <v-chip
      class="active-chat-message__time text-caption ms-2"
      :class="{ absolute: isSingleEmoji || message.image }"
      :variant="isTransparent ? 'flat' : 'text'"
      :size="isTransparent ? 'small' : 'xs'"
    >
      {{ timestampToTime(message.date?.seconds) }}
    </v-chip>
  </v-card>
</template>

<style lang="scss" scoped>
.active-chat-message {
  position: relative;
  width: max-content;
  max-width: 100%;
  border-radius: 15px 15px 15px 0;
  display: flex;
  align-items: flex-end;
  pointer-events: none;
  &.transparent {
    background-color: transparent !important;
  }
  &.clickable {
    cursor: pointer;
    pointer-events: all;
  }
  &.owner {
    margin-left: auto;
    border-radius: 15px 15px 0 15px;
  }
  &__time {
    flex-shrink: 0;
    &.absolute {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
