<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps({ src: String })

const isOpened = ref(false)
const imageEl = ref()
const imageSize = computed(() => ({
  height: imageEl.value?.naturalHeight,
  width: imageEl.value?.naturalWidth
}))
</script>

<template>
  <v-dialog class="image-modal" v-model="isOpened">
    <div class="pa-1">
        <v-btn class="image-modal__close" icon @click="() => isOpened = false">
            <v-icon icon="mdi-close"/>
        </v-btn>
      <v-img :src="src" ref="imageEl" :width="imageSize.width" :height="imageSize.height" />
    </div>
  </v-dialog>
</template>

<style lang="scss" scoped>
.image-modal{
    &__close{
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(35%, -35%);
        z-index: 5;
    }
    :deep(){
        .v-overlay__content{
            width: max-content;
        }
        .v-card{
            overflow: visible !important;
        }
    }
}
</style>
