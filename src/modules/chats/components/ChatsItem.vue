<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { computed, inject, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setDoc, doc, updateDoc, serverTimestamp, getDoc, type Firestore } from 'firebase/firestore'
import type { User } from '@/types/user'
import type { Chat } from '@/types/chat'
import { useChatsStore } from '@/stores/chats'
import { useLanguageStore } from '@/stores/language'
import dictionary from '../dictionary.json'

interface Props {
  user?: User
  chat?: Chat
  search?: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:search'])

const route = useRoute()
const router = useRouter()
const activeChatUid = computed(() => route.query.chat)
const userStore = useUserStore()
const chatsStore = useChatsStore()
const { user: currentUser } = storeToRefs(userStore)
const fbDB = inject<Firestore>('fbDB')
const item = computed(() => props.user || props.chat?.userInfo)
const isLoading = ref<boolean>(false)
const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)

const clickUser = async () => {
  if (!props.user || !fbDB || isLoading.value) return
  //check whether the group(chats in firestore) exists, if not create
  const combinedId = currentUser.value?.uid + props.user.uid
  const res = await getDoc(doc(fbDB, 'chats', combinedId))

  if (!res.exists()) {
    isLoading.value = true
    //create a chat in chats collection
    await setDoc(doc(fbDB, 'chats', combinedId), { messages: [] })

    //create user chats
    await updateDoc(doc(fbDB, 'userChats', currentUser.value?.uid as string), {
      [combinedId + '.userInfo']: {
        uid: props.user.uid,
        displayName: props.user.displayName,
        photoURL: props.user.photoURL,
        color: props.user.color
      },
      [combinedId + '.date']: serverTimestamp()
    })

    await updateDoc(doc(fbDB, 'userChats', props.user.uid), {
      [combinedId + '.userInfo']: {
        uid: currentUser.value?.uid,
        displayName: currentUser.value?.displayName,
        photoURL: currentUser.value?.photoURL,
        color: currentUser.value?.color
      },
      [combinedId + '.date']: serverTimestamp()
    })

    isLoading.value = false
  }

  router.push(`/?chat=${combinedId}`)
  emit('update:search', '')
}

const clickChat = () => {
  if (!props.chat) return

  router.push(`/?chat=${props.chat.uid}`)
}

const handleClick = () => {
  props.user ? clickUser() : clickChat()
}

watch(
  activeChatUid,
  () => {
    if (props.chat?.uid === activeChatUid.value) {
      chatsStore.setActiveChat(props.chat)
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-list-item
    :active="!!chat?.uid && chat?.uid === activeChatUid"
    active-color="primary"
    link
    class="chats__item px-2"
    @click="handleClick"
  >
    <div class="d-flex gap-2">
      <v-avatar size="50" :color="item?.color">
        <v-progress-circular v-if="isLoading" indeterminate size="small" width="2" />
        <v-img v-else-if="item?.photoURL" :src="item.photoURL" cover></v-img>
        <div v-else class="text-h5">{{ item?.displayName?.slice(0, 1) }}</div>
      </v-avatar>
      <div class="ms-2 d-flex flex-column justify-center">
        <div>{{ item?.displayName }}</div>
        <div v-if="user" class="text-disabled">{{ user.email }}</div>
        <div v-else-if="chat?.lastMessage" class="chats__item-msg text-disabled">
          {{ chat.lastMessage.text }}
        </div>
        <div v-else class="text-disabled">{{ dictionary.no_messages[lang] }}</div>
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
