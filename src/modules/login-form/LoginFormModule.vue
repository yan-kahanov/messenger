<script setup lang="ts">
import { ref, reactive } from 'vue'
import { emailValidator, requiredValidator, minLengthValidator } from '@/helpers/validators'
import VPasswordField from '@/components/VPasswordField.vue'

interface Form {
  email: string
  password: string
  isRememberMe: boolean
}
const form: Form = reactive({
  email: '',
  password: '',
  isRememberMe: false
})

const formEl = ref<null | any>(null)

const submit = async () => {
  if (!formEl.value) return

  const { valid } = await formEl.value.validate()

  if (valid) console.log('valid')
}
</script>

<template>
  <v-card :style="{ width: '375px' }">
    <v-form class="pa-6" @submit.prevent="submit" ref="formEl">
      <p class="text-h4 text-center mb-4">Авторизация</p>
      <v-text-field
        v-model="form.email"
        variant="outlined"
        label="Email"
        :rules="[emailValidator, requiredValidator]"
      >
      </v-text-field>
      <v-password-field
        class="mt-2"
        variant="outlined"
        label="Пароль"
        :rules="[requiredValidator, (e: string) => minLengthValidator(e, 5)]"
      >
      </v-password-field>
      <v-checkbox class="mb-2" hide-details density="compact" label="Запомнить меня"></v-checkbox>
      <v-btn color="primary" block type="submit">Войти</v-btn>
      <v-btn class="text-lowercase" variant="text" block @click="() => $router.push('/registration')">Создать аккаунт</v-btn>
    </v-form>
  </v-card>
</template>
