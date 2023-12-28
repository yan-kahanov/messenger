<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted, provide, ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, type User as fbUser } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import type { User } from '@/types/user'
import { useRoute, useRouter } from 'vue-router'
import { getFirestore } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { collection, query, where, getDocs } from 'firebase/firestore'

const theme = useTheme()
const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const fbApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
})
const fbAuth = getAuth(fbApp)
const fbDB = getFirestore()
const fbStorage = getStorage()
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

onAuthStateChanged(fbAuth, async (user: fbUser | null) => {
  await router.isReady()
  const isAuthPage = route.name === 'login' || route.name === 'registration'

  if (user) {
    const q = query(collection(fbDB, 'users'), where('uid', '==', user?.uid))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      userStore.setUser(doc.data() as User)
    })
    if(isAuthPage) router.replace('/')
  }else{
    userStore.setUser(null)
    if(!isAuthPage) router.replace('/login')
  }

  isLoading.value = false
})

provide('fbApp', fbApp)
provide('fbAuth', fbAuth)
provide('fbDB', fbDB)
provide('fbStorage', fbStorage)
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
