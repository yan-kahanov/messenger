<script setup lang="ts">
import { ref, reactive, inject, computed } from 'vue'
import {
  emailValidator,
  requiredValidator,
  minLengthValidator,
  confirmedValidator
} from '@/helpers/validators'
import VPasswordField from '@/components/v-password-field/index.vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import getRandomNum from '@/helpers/getRandomNum'
import { useUserStore } from '@/stores/user'
import { useLanguageStore } from '@/stores/language'
import dictionary from './dictionary.json'

interface Form {
  name: string
  email: string
  password: string
  repeatPassword: string
}
const form: Form = reactive({
  name: '',
  email: '',
  password: '',
  repeatPassword: ''
})

const formEl = ref<null | any>(null)
const fbAuth = inject<any>('fbAuth')
const fbDB = inject<any>('fbDB')
const isLoading = ref(false)
const isEmailInUse = ref(false)
const userStore = useUserStore()
const langStore = useLanguageStore()
const lang = computed(() => langStore.lang)
const colors = [
  '#F06292',
  '#BA68C8',
  '#42A5F5',
  '#66BB6A',
  '#FF7043',
  '#651FFF',
  '#536DFE',
  '#00B8D4',
  '#00BFA5'
]

const submit = async () => {
  if (!formEl.value) return

  const { valid } = await formEl.value.validate()

  if (valid && !isEmailInUse.value) {
    const { email, password, name } = form
    const color = colors[getRandomNum(colors.length - 1)]

    isLoading.value = true
    createUserWithEmailAndPassword(fbAuth, email, password)
      .then(async (res) => {
        const newUser = {
          uid: res.user.uid,
          displayName: name,
          email,
          photoURL: null,
          color
        }
        formEl.value.reset()
        // update profile
        await updateProfile(res.user, {
          displayName: name
        })
        // create user on firestore
        await setDoc(doc(fbDB, 'users', res.user.uid), newUser)
        userStore.setUser(newUser)
        //create empty user chats on firestore
        await setDoc(doc(fbDB, 'userChats', res.user.uid), {})
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
      <p class="text-h4 text-center mb-4">{{ dictionary.title[lang] }}</p>
      <v-text-field
        v-model="form.name"
        variant="outlined"
        :label="dictionary.name[lang]"
        :rules="[requiredValidator]"
      />
      <v-text-field
        v-model="form.email"
        class="mt-2"
        variant="outlined"
        :label="dictionary.email[lang]"
        :rules="[emailValidator, requiredValidator]"
        :error-messages="isEmailInUse ? [dictionary.email_is_already_in_use[lang]] : []"
        @update:model-value="() => (isEmailInUse = false)"
      >
      </v-text-field>
      <v-password-field
        v-model="form.password"
        class="mt-2"
        variant="outlined"
        :label="dictionary.password[lang]"
        :rules="[requiredValidator, (e: string) => minLengthValidator(e, 6)]"
      />
      <v-password-field
        v-model="form.repeatPassword"
        class="mt-2"
        variant="outlined"
        :label="dictionary.repassword[lang]"
        :rules="[
          requiredValidator,
          (e: string) => minLengthValidator(e, 6),
          (e: string) => confirmedValidator(e, form.password)
        ]"
      >
      </v-password-field>
      <v-btn class="mt-3" color="primary" block type="submit" :loading="isLoading">{{
        dictionary.create[lang]
      }}</v-btn>
      <v-btn
        class="text-lowercase"
        variant="text"
        block
        :disabled="isLoading"
        @click="() => $router.push('/login')"
        >{{ dictionary.already_have_an_account[lang] }}</v-btn
      >
    </v-form>
  </v-card>
</template>
