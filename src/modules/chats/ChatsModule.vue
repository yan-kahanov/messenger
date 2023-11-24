<script setup lang="ts">
import { useRoute } from 'vue-router'
import ChatsItem from './components/ChatsItem.vue'
import ChatsSearch from './components/ChatsSearch.vue'
import ChatsMenu from './components/ChatsMenu.vue'
import { computed, ref } from 'vue'

const route = useRoute()
const activeChatId = computed(() => route.query.chat)
const isMenuOpened = ref<boolean>(false)

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
  <chats-menu v-model="isMenuOpened" />
  <v-list class="chats pt-0" :class="{ openedChat: !!activeChatId }" border>
    <div class="d-flex align-center pa-2">
      <v-btn
        class="me-1"
        icon
        variant="text"
        size="small"
        color="disabled"
        @click="isMenuOpened = !isMenuOpened"
      >
        <v-icon icon="mdi-menu" size="26" />
      </v-btn>
      <chats-search />
    </div>
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
