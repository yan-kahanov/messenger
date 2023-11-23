<script setup lang="ts">
import { ref, reactive } from 'vue'
import { emailValidator, requiredValidator, minLengthValidator } from '@/helpers/validators'
import VPasswordField from '@/components/VPasswordField.vue'

interface Form {
  email: string
  password: string
  repeatPassword: string
}
const form: Form = reactive({
  email: '',
  password: '',
  repeatPassword: ''
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
      <p class="text-h4 text-center mb-4">Регистрация</p>
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
      />
      <v-password-field
        class="mt-2"
        variant="outlined"
        label="Повторите пароль"
        :rules="[requiredValidator, (e: string) => minLengthValidator(e, 5)]"
      >
      </v-password-field>
      <v-btn class="mt-3" color="primary" block type="submit">Создать</v-btn>
      <v-btn class="text-lowercase" variant="text" block @click="() => $router.push('/login')">уже есть аккаунт</v-btn>
    </v-form>
  </v-card>
</template>
