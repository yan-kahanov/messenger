<script setup lang="ts">
import { signOut } from 'firebase/auth'
import { inject } from 'vue'
const fbAuth = inject<any>('fbAuth')
</script>

<template>
  <v-navigation-drawer temporary>
    <v-list-item>
      <div class="d-flex align-center py-4">
        <v-avatar size="50">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover></v-img>
        </v-avatar>
        <div class="ms-2">
          <div>Test</div>
          <div>test@test.com</div>
        </div>
      </div>
    </v-list-item>
    <v-divider />
    <v-btn class="sign-out-btn" variant="tonal-filled" @click="() => signOut(fbAuth)">
      Выйти
    </v-btn>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.sign-out-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
