<script setup lang="ts">
defineProps({
  field: String
})
defineEmits(['update:field'])

const emojis = [
  ['😀', '😁', '😂', '😃', '😄', '😅'],
  ['😆', '😇', '😈', '😉', '😊', '😋'],
  ['😌', '😍', '😎', '😏', '😐', '😑'],
  ['😒', '😓', '😔', '😕', '😖', '😗'],
  ['😘', '😙', '😚', '😛', '😜', '😝'],
  ['😞', '😟', '😠', '😡', '😢', '😣'],
  ['😤', '😥', '😦', '😧', '😨', '😩'],
  ['😪', '😫', '😬', '😭', '😮', '😯'],
  ['😰', '😱', '😲', '😳', '😴', '😵']
]
</script>

<template>
  <v-menu activator="parent" :close-on-content-click="false">
    <v-card class="pa-4">
      <v-row v-for="(emojiRow, index) in emojis" :key="index">
        <v-column
          v-for="(emoji, index) in emojiRow"
          :key="index"
          class="text-h5 pt-1"
          :style="{ userSelect: 'none' }"
        >
          <v-card @click="() => $emit('update:field', field + emoji)" flat class="px-2">
            {{ emoji }}
          </v-card>
        </v-column>
      </v-row>
    </v-card>
  </v-menu>
</template>
