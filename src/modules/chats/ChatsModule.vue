<script setup lang="ts">
import { useRoute } from 'vue-router'
import ChatsItem from './components/ChatsItem.vue'
import ChatsSearch from './components/ChatsSearch.vue'
import ChatsMenu from './components/ChatsMenu.vue'
import { computed, ref, onMounted, inject } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { doc, onSnapshot, type Firestore } from 'firebase/firestore'
import type { Chat } from '@/types/chat'
import { useLanguageStore } from '@/stores/language'
import dictionary from './dictionary.json'

const route = useRoute()
const activeChatId = computed(() => route.query.chat)
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const fbDB = inject<Firestore>('fbDB')
const isMenuOpened = ref<boolean>(false)
const search = ref('')
const isSearching = ref(false)
const chats = ref<Chat[]>([])
const users = ref([])
const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)

onMounted(() => {
  if (fbDB && user.value?.uid) {
    isSearching.value = true
    onSnapshot(doc(fbDB, 'userChats', user.value?.uid as string), (doc) => {
      const newChats: Chat[] = []
      const res = doc.data()

      for (let key in res) {
        newChats.push({ uid: key, ...res[key] })
      }
      newChats.sort((a, b) => b.date?.seconds - a.date?.seconds)

      chats.value = newChats
      isSearching.value = false
    })
  }
})
</script>

<template>
  <chats-menu v-model="isMenuOpened" />
  <v-list class="chats pt-0" :class="{ openedChat: !!activeChatId }" border>
    <div class="d-flex align-center px-2 py-3">
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
      <chats-search
        v-model:users="users"
        v-model:search="search"
        v-model:is-searching="isSearching"
      />
    </div>
    <div v-if="isSearching" class="d-flex justify-center pa-5">
      <v-progress-circular indeterminate />
    </div>
    <div
      v-else-if="(!chats.length && !search?.length) || (!users.length && search?.length)"
      class="text-center pt-5"
    >
      {{ dictionary.empty_list[lang] }}
    </div>
    <div v-else-if="search?.length">
      <chats-item
        v-for="(user, index) in users"
        :key="index"
        :user="user"
        v-model:search="search"
      />
    </div>
    <div v-else>
      <chats-item
        v-for="(chat, index) in chats"
        :key="index"
        :chat="chat"
        v-model:search="search"
      />
    </div>
  </v-list>
</template>

<style scoped lang="scss">
.chats {
  transition: all 0.15s;
  width: 420px;
  height: 100%;
  flex-shrink: 0;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
  &.openedChat {
    @media screen and (max-width: 900px) {
      width: 0;
    }
  }
}
</style>
