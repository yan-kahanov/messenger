<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted, provide, ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'
import { getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

const theme = useTheme()
const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const fbApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_AROJECT_ID,
  storageBucket: import.meta.env.VITE_ATORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_AESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
})
const fbAuth = getAuth(fbApp)
const fbDB = getFirestore()
const userStore = useUserStore()

const setTheme = () => {
  const isSystemThemeDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const systemTheme = isSystemThemeDark ? 'dark' : 'light'
  const lastTheme = localStorage.getItem('theme')
  theme.global.name.value = lastTheme || systemTheme
}

onMounted(() => {
  setTheme()
})

onAuthStateChanged(fbAuth, async (user: User | null) => {
  await router.isReady()
  const isAuthPage = route.name === 'login' || route.name === 'registration'
  userStore.setUser(user)

  if (user && isAuthPage) {
    router.replace('/')
  } else if (!user && !isAuthPage) {
    router.replace('/login')
  }

  isLoading.value = false
})

provide('fbApp', fbApp)
provide('fbAuth', fbAuth)
provide('fbDB', fbDB)
</script>

<template>
  <v-app>
    <v-main>
      <div v-if="isLoading" class="d-flex justify-center align-center h-100">
        <v-progress-circular color="primary" indeterminate size="40" />
      </div>
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<style lang="scss">
html {
  overflow: hidden !important;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(var(--v-border-color), 0.3);
}
</style>
