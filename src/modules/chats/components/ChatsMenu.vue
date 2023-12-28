<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { signOut } from 'firebase/auth'
import { inject } from 'vue'
import { storeToRefs } from 'pinia'

const theme = useTheme()
const fbAuth = inject<any>('fbAuth')
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const toggleTheme = () => {
  const isCurrentDark = theme.global.current.value.dark
  const newTheme = isCurrentDark ? 'light' : 'dark'

  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}

</script>

<template>
  <v-navigation-drawer temporary>
    <v-list-item>
      <div class="d-flex align-center py-4">
        <v-avatar size="50" :color="user?.color">
          <v-img v-if="user?.photoURL" :src="user?.photoURL" cover></v-img>
          <div v-else class="text-h5">{{ user?.displayName?.slice(0, 1) }}</div>
        </v-avatar>
        <div class="ms-2">
          <div>{{ user?.displayName }}</div>
          <div>{{ user?.email }}</div>
        </div>
      </div>
    </v-list-item>
    <v-divider />
    <v-list-item class="py-3" @click="toggleTheme">
      <v-list-item-title :style="{ userSelect: 'none' }">
        <v-icon icon="mdi-brightness-6" class="me-3"></v-icon>
        Сменить тему
      </v-list-item-title>
    </v-list-item>
    <v-btn class="sign-out-btn" @click="() => signOut(fbAuth)"> Выйти </v-btn>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.sign-out-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
