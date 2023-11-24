<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { inject } from 'vue'

const fbAuth = inject<any>('fbAuth')
</script>

<template>
  <div>
    <v-card class="ma-4 pa-6" color="primary">
      <v-btn @click="() => signOut(fbAuth)">выйти</v-btn>
    </v-card>
  </div>
</template>
