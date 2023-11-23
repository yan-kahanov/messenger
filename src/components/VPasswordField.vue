<script setup lang="ts">
import { ref } from 'vue'
const isPasswordVisible = ref<boolean>(false)
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
        <v-icon icon="mdi-eye" size="24" />
        <v-tooltip
          activator="parent"
          :text="isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'"
        />
      </v-btn>
    </template>
  </v-text-field>
</template>
