<script setup lang="ts">
import { useChatsStore } from '@/stores/chats'
import { computed } from 'vue';
import { useRouter } from 'vue-router'

const chatsStore = useChatsStore()
const router = useRouter()
const user = computed(() => chatsStore.activeChat?.userInfo)

const toBack = () => {
  router.push('/')
  chatsStore.setActiveChat(null)
}
</script>

<template>
  <v-card class="flex-shrink-0 px-3 py-2" :rounded="0" flat border :style="{ borderLeft: '0' }">
    <div class="d-flex align-center">
      <v-btn
        class="active-chat-header__back-btn me-3"
        @click="toBack"
        size="small"
        variant="text"
        icon
        color="disabled"
      >
        <v-icon icon="mdi-arrow-left" size="26" />
      </v-btn>
      <div>
        <v-avatar size="46" :color="user?.color">
          <v-img
            v-if="user?.photoURL"
            :src="user?.photoURL"
            cover
          ></v-img>
          <div v-else class="text-h5">
            {{ user?.displayName?.slice(0, 1) }}
          </div>
        </v-avatar>
      </div>
      <div class="ms-3">{{ user?.displayName }}</div>
    </div>
  </v-card>
</template>
