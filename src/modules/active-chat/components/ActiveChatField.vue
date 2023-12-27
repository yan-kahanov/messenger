<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { v4 as uuid } from 'uuid'
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  Firestore
} from 'firebase/firestore'
import { getDownloadURL, ref as fbRef, uploadBytesResumable } from 'firebase/storage'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useChatsStore } from '@/stores/chats'

const fbDB = inject<Firestore>('fbDB')
const fbStorage = inject<any>('fbStorage')
const field = ref('')
const chatsStore = useChatsStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const route = useRoute()
const chatUid = computed(() => route.query.chat)
const companionUid = computed(() => chatsStore.activeChat?.userInfo.uid)
const fileInputEl = ref()

const sendMessage = async (message: string) => {
  if (!user.value || !chatUid.value || !companionUid.value || !fbDB || !field.value) return
  field.value = ''
  
  await updateDoc(doc(fbDB, 'chats', chatUid.value as string), {
    messages: arrayUnion({
      id: uuid(),
      text: message,
      senderId: user.value.uid,
      date: Timestamp.now()
    })
  })

  await updateUserChat(user.value?.uid || '', message)
  await updateUserChat(companionUid.value as string, message)
}

const updateUserChat = (userUid: string, message: string) => {
  if (!fbDB) return

  return updateDoc(doc(fbDB, 'userChats', userUid), {
    [chatUid.value + '.lastMessage']: {
      text: message
    },
    [chatUid.value + '.date']: serverTimestamp()
  })
}

const clickOnFileInput = () => {
  fileInputEl.value.click()
}

const saveFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]

  if (!file || !fbDB) return
  
  const fileType = file.type.split('/')[0] === 'image' ? 'image' : 'file'
  const storageRef = fbRef(fbStorage, uuid())
  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on(
    () => {},
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        await updateDoc(doc(fbDB, 'chats', chatUid.value as string), {
          messages: arrayUnion({
            id: uuid(),
            senderId: user.value?.uid,
            date: Timestamp.now(),
            [fileType]: {
              name: file.name,
              size: file.size,
              url: downloadURL
            }
          })
        })

        await updateUserChat(user.value?.uid || '', file.name)
        await updateUserChat(companionUid.value as string, file.name)
      })
    }
  )
}
</script>

<template>
  <v-card class="flex-shrink-0 px-1" :rounded="0" flat border :style="{ borderLeft: '0' }">
    <div class="d-flex align-center">
      <v-btn icon variant="text" color="disabled" @click="clickOnFileInput">
        <v-icon icon="mdi-paperclip" size="30" />
        <input ref="fileInputEl" class="d-none" type="file" id="file" @change="saveFile" />
      </v-btn>
      <v-textarea
        v-model="field"
        rows="1"
        variant="solo"
        placeholder="Написать сообщение..."
        flat
        hide-details
        no-resize
        @keydown.prevent.enter="() => sendMessage(field)"
      ></v-textarea>
      <v-btn icon variant="text" color="disabled">
        <v-icon icon="mdi-emoticon-happy-outline" size="30" />
      </v-btn>
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="() => sendMessage(field)"
        :disabled="!field.length"
      >
        <v-icon icon="mdi-send" size="30" />
      </v-btn>
    </div>
  </v-card>
</template>
