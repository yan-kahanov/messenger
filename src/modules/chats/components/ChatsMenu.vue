<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/user'
import { signOut } from 'firebase/auth'
import { inject, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLanguageStore } from '@/stores/language'
import dictionary from '../dictionary.json'

const theme = useTheme()
const fbAuth = inject<any>('fbAuth')
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)

const toggleTheme = () => {
  const isCurrentDark = theme.global.current.value.dark
  const newTheme = isCurrentDark ? 'light' : 'dark'

  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}

const items = computed(() => [
  { title: 'change_theme', icon: 'brightness-6', func: toggleTheme },
  { title: 'change_language', icon: 'translate', func: langStore.toggleLang }
])
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
    <v-list-item v-for="(item, index) in items" :key="index" class="py-3" @click="item.func">
      <v-list-item-title :style="{ userSelect: 'none' }">
        <v-icon :icon="`mdi-${item.icon}`" class="me-3"></v-icon>
        {{ dictionary[item.title as keyof typeof dictionary][lang] }}
      </v-list-item-title>
    </v-list-item>
    <v-btn class="sign-out-btn" @click="() => signOut(fbAuth)"> {{ dictionary.exit[lang] }} </v-btn>
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
