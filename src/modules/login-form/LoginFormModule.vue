<script setup lang="ts">
import { ref, reactive, inject } from 'vue'
import { emailValidator, requiredValidator, minLengthValidator } from '@/helpers/validators'
import VPasswordField from '@/components/VPasswordField.vue'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

interface Form {
  email: string
  password: string
  isRememberMe: boolean
}
const form: Form = reactive({
  email: '',
  password: '',
  isRememberMe: true
})

const formEl = ref<null | any>(null)
const fbAuth = inject<any>('fbAuth')
const isLoading = ref<boolean>(false)
const isWrongData = ref<boolean>(false)
const router = useRouter()

const submit = async () => {
  if (!formEl.value) return

  const { valid } = await formEl.value.validate()
  isWrongData.value = false

  if (valid) {
    const { email, password } = form

    isLoading.value = true

    signInWithEmailAndPassword(fbAuth, email, password)
      .then(() => {
        router.push('/')
        saveOrRemoveUser()
        formEl.value.reset()
      })
      .catch(() => (isWrongData.value = true))
      .finally(() => (isLoading.value = false))
  }
}

const saveOrRemoveUser = () => {
  const { email, password, isRememberMe } = form

  if (isRememberMe) {
    localStorage.setItem('userData', JSON.stringify({ email, password }))
  } else {
    localStorage.removeItem('userData')
  }
}

const setSavedData = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || 'null')

  if (userData) {
    const { email, password } = userData

    form.email = email
    form.password = password
  }
}

onMounted(() => {
  setSavedData()
})
</script>

<template>
  <v-card :style="{ width: '375px' }">
    <v-form class="pa-6" @submit.prevent="submit" ref="formEl" :disabled="isLoading">
      <p class="text-h4 text-center mb-4">Авторизация</p>
      <v-text-field
        v-model="form.email"
        variant="outlined"
        label="Email"
        :rules="[emailValidator, requiredValidator]"
        :error-messages="isWrongData ? ['Неверный email или пароль'] : []"
      >
      </v-text-field>
      <v-password-field
        class="mt-2"
        variant="outlined"
        v-model="form.password"
        label="Пароль"
        :rules="[requiredValidator, (e: string) => minLengthValidator(e, 6)]"
        :error-messages="isWrongData ? ['Неверный email или пароль'] : []"
      >
      </v-password-field>
      <v-checkbox
        class="mb-2"
        v-model="form.isRememberMe"
        hide-details
        density="compact"
        label="Запомнить меня"
      ></v-checkbox>
      <v-btn color="primary" block type="submit" :loading="isLoading">Войти</v-btn>
      <v-btn
        class="text-lowercase"
        variant="text"
        block
        :disabled="isLoading"
        @click="() => $router.push('/registration')"
        >Создать аккаунт</v-btn
      >
    </v-form>
  </v-card>
</template>
