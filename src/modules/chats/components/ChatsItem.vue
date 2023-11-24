<script setup lang="ts">
interface Props {
  chat: { id: number; name: string; lastMsg: string }
}
defineProps<Props>()
</script>

<template>
  <v-list-item link class="px-2" @click="() => $router.push(`/?chat=${chat.id}`)">
    <div class="d-flex gap-2">
      <v-avatar size="50">
        <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover></v-img>
      </v-avatar>
      <div class="ms-2">
        <div>{{ chat.name }}</div>
        <div class="chats__item-msg text-disabled">{{ chat.lastMsg }}</div>
      </div>
    </div>
  </v-list-item>
</template>

<style scoped lang="scss">
.chats__item {
  &-msg {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    max-width: 340px;
    white-space: nowrap;
    @media screen and (max-width: 700px) {
      max-width: calc(100vw - 80px);
    }
  }
}
</style>
