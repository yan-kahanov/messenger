<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted, provide } from 'vue'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const theme = useTheme()

const fbApp = initializeApp({
  apiKey: 'AIzaSyCs61mZ4aIrZ4uGWuNW_hi-NeKR0S4i4Fc',
  authDomain: 'chat-cc2f1.firebaseapp.com',
  projectId: 'chat-cc2f1',
  storageBucket: 'chat-cc2f1.appspot.com',
  messagingSenderId: '677562325179',
  appId: '1:677562325179:web:01bb7cb0a61b1e9d3d719e'
})
const fbAuth = getAuth(fbApp)

onMounted(() => {
  setTheme()
})

const setTheme = () => {
  const isSystemThemeDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const systemTheme = isSystemThemeDark ? 'dark' : 'light'
  const lastTheme = localStorage.getItem('theme')
  theme.global.name.value = lastTheme || systemTheme
}

provide('fbApp', fbApp)
provide('fbAuth', fbAuth)
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
