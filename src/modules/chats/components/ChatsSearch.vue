<script setup lang="ts">
import debounce from '@/helpers/debouce'
import { useUserStore } from '@/stores/user'
import { type User } from '@/types/user'
import { collection, query, where, getDocs, or, and } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { inject } from 'vue'
import capitalizeFirstLetter from '@/helpers/capitalizeFirstLetter'

interface Props {
  users: User[]
  search: string
  isSearching: boolean
}
defineProps<Props>()
const emit = defineEmits(['update:users', 'update:search', 'update:isSearching'])

const fbDB = inject<any>('fbDB')
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const handleSearch = debounce(async (searchQuery: string) => {
  emit('update:search', searchQuery)
  if (!searchQuery) return
  emit('update:isSearching', true)

  const q = query(
    collection(fbDB, 'users'),
    and(
      where('uid', '!=', user.value?.uid),
      or(
        where('displayName', '==', searchQuery),
        where('displayName', '==', capitalizeFirstLetter(searchQuery)),
        where('email', '==', searchQuery)
      )
    )
  )

  const foundUsers: User[] = []

  const querySnapshot = await getDocs(q)
  emit('update:isSearching', false)

  querySnapshot.forEach((doc) => {
    foundUsers.push(doc.data() as User)
  })
  emit('update:users', foundUsers)
})
</script>

<template>
  <v-text-field
    :model-value="search"
    @update:model-value="handleSearch"
    placeholder="Поиск"
    variant="solo-filled"
    rounded
    density="compact"
    flat
    hide-details
    clearable
  ></v-text-field>
</template>
