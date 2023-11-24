<script setup lang="ts">
import { useRoute } from 'vue-router'
import ChatsItem from './components/ChatsItem.vue'
import { computed } from 'vue'

const route = useRoute()
const activeChatId = computed(() => route.query.chat)

const chats = [
  {
    id: 1,
    name: 'Вася',
    lastMsg:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum ab molestiae itaque et laudantium. Porro sed maiores laboriosam aliquid placeat repellat explicabo assumenda iusto! Quam quas error delectus enim sapiente.'
  },
  {
    id: 2,
    name: 'Коля',
    lastMsg: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, ipsam.'
  },
  { id: 3, name: 'Петя', lastMsg: 'Lorem ipsum dolor sit amet.' }
]
</script>

<template>
  <v-list class="chats" :class="{ openedChat: !!activeChatId }">
    <chats-item v-for="(chat, index) in chats" :key="index" :chat="chat" />
  </v-list>
</template>

<style scoped lang="scss">
.chats {
  transition: all 0.3s;
  max-width: 420px;
  height: 100%;
  @media screen and (max-width: 700px) {
    max-width: 100%;
  }
  &.openedChat {
    @media screen and (max-width: 900px) {
      max-width: 0;
    }
  }
}
</style>
