<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted, provide, ref } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'

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

onAuthStateChanged(fbAuth, async (user) => {
  await router.isReady()
  const isAuthPage = route.name === 'login' || route.name === 'registration'

  if (user && isAuthPage) {
    router.replace('/')
  } else if(!user && !isAuthPage) {
    router.replace('/login')
  }

  isLoading.value = false
})

provide('fbApp', fbApp)
provide('fbAuth', fbAuth)
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
