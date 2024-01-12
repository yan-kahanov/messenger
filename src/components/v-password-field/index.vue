<script setup lang="ts">
import { useLanguageStore } from '@/stores/language';
import { ref, computed } from 'vue'
import dictionary from './dictionary.json'

const isPasswordVisible = ref<boolean>(false)
const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)
</script>

<template>
  <v-text-field :type="isPasswordVisible ? 'text' : 'password'">
    <template #append-inner>
      <v-btn
        icon
        variant="text"
        size="small"
        @click="() => (isPasswordVisible = !isPasswordVisible)"
      >
        <v-icon :icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'" size="24" />
        <v-tooltip
          activator="parent"
          :text="isPasswordVisible ? dictionary.hide[lang] : dictionary.show[lang]"
        />
      </v-btn>
    </template>
  </v-text-field>
</template>
