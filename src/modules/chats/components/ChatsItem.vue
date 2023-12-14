<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, inject } from 'vue'
import { useRoute } from 'vue-router'
import { setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import router from '@/router'
import type { User } from '@/types/user'
import type { Chat } from '@/types/chat'

interface Props {
  user?: User
  chat?: Chat
}
const props = defineProps<Props>()

const route = useRoute()
const activeChatUid = computed(() => route.query.chat)
const userStore = useUserStore()
const { user: currentUser } = storeToRefs(userStore)
const fbDB = inject<any>('fbDB')
const item = computed(() => props.user || props.chat.userInfo)

const clickUser = async () => {
  if(!props.user) return
  //check whether the group(chats in firestore) exists, if not create
  const combinedId = currentUser.value?.uid + props.user.uid
  const res = await getDoc(doc(fbDB, 'chats', combinedId))

  if (!res.exists()) {
    //create a chat in chats collection
    await setDoc(doc(fbDB, 'chats', combinedId), { messages: [] })

    //create user chats
    await updateDoc(doc(fbDB, 'userChats', currentUser.value?.uid), {
      [combinedId + '.userInfo']: {
        uid: props.user.uid,
        displayName: props.user.displayName,
        photoURL: props.user.photoURL
      },
      [combinedId + '.date']: serverTimestamp()
    })

    await updateDoc(doc(fbDB, 'userChats', props.user.uid), {
      [combinedId + '.userInfo']: {
        uid: currentUser.value?.uid,
        displayName: currentUser.value?.displayName,
        photoURL: currentUser.value?.photoURL
      },
      [combinedId + '.date']: serverTimestamp()
    })
  }
}

const clickChat = () => {
  router.push(`/?chat=${item.value.uid}`)
}

const handleClick = () => {
  props.user ? clickUser() : clickChat()
}
</script>

<template>
  <v-list-item
    :active="item?.uid === activeChatUid"
    active-color="primary"
    link
    class="chats__item px-2"
    @click="handleClick"
  >
    <div class="d-flex gap-2">
      <v-avatar size="50" color="surface-variant">
        <v-img v-if="item.photoURL" :src="item.photoURL" cover></v-img>
        <div v-else class="text-h5">{{ item?.displayName?.slice(0, 1) }}</div>
      </v-avatar>
      <div class="ms-2 d-flex flex-column justify-center">
        <div>{{ item?.displayName }}</div>
        <div v-if="user" class="text-disabled">{{ user.email }}</div>
        <div v-else class="chats__item-msg text-disabled">
          Нет сообщений
        </div>
      </div>
    </div>
  </v-list-item>
</template>

<style scoped lang="scss">
.chats__item {
  user-select: none;
  &-msg {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    max-width: 340px;
    white-space: nowrap;
    @media screen and (max-width: 700px) {
      max-width: calc(100vw - 80px);
    }
  }
}
</style>
