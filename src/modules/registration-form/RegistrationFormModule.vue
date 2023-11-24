<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import {
  emailValidator,
  requiredValidator,
  minLengthValidator,
  confirmedValidator
} from '@/helpers/validators'
import VPasswordField from '@/components/VPasswordField.vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'

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
const fbAuth = inject<any>('fbAuth')
const isLoading = ref(false)
const isEmailInUse = ref(false)

const submit = async () => {
  if (!formEl.value) return

  const { valid } = await formEl.value.validate()

  if (valid && !isEmailInUse.value) {
    const { email, password } = form

    isLoading.value = true
    createUserWithEmailAndPassword(fbAuth, email, password)
      .then(() => {
        formEl.value.reset()
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          isEmailInUse.value = true
        }
      })
      .finally(() => (isLoading.value = false))
  }
}
</script>

<template>
  <v-card :style="{ width: '375px' }">
    <v-form class="pa-6" @submit.prevent="submit" ref="formEl" :disabled="isLoading">
      <p class="text-h4 text-center mb-4">Регистрация</p>
      <v-text-field
        v-model="form.email"
        variant="outlined"
        label="Email"
        :rules="[emailValidator, requiredValidator]"
        :error-messages="isEmailInUse ? ['Email уже используется'] : []"
        @update:model-value="() => isEmailInUse = false"
      >
      </v-text-field>
      <v-password-field
        v-model="form.password"
        class="mt-2"
        variant="outlined"
        label="Пароль"
        :rules="[requiredValidator, (e: string) => minLengthValidator(e, 6)]"
      />
      <v-password-field
        v-model="form.repeatPassword"
        class="mt-2"
        variant="outlined"
        label="Повторите пароль"
        :rules="[
          requiredValidator,
          (e: string) => minLengthValidator(e, 6),
          (e: string) => confirmedValidator(e, form.password)
        ]"
      >
      </v-password-field>
      <v-btn class="mt-3" color="primary" block type="submit" :loading="isLoading">Создать</v-btn>
      <v-btn
        class="text-lowercase"
        variant="text"
        block
        :disabled="isLoading"
        @click="() => $router.push('/login')"
        >уже есть аккаунт</v-btn
      >
    </v-form>
  </v-card>
</template>
