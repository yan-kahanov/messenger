<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'

const theme = useTheme()

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
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
