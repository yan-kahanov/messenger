<script setup lang="ts">
import { ChatsModule } from '@/modules/chats'
import { signOut } from 'firebase/auth'
import { inject } from 'vue'

const fbAuth = inject<any>('fbAuth')
</script>

<template>
  <div class="h-100">
    <chats-module />
    <v-btn
      @click="() => signOut(fbAuth)"
      color="primary"
      :style="{ position: 'fixed', bottom: '20px', right: '20px' }"
    >
      выйти
    </v-btn>
  </div>
</template>
