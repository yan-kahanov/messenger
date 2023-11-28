<template>
  <v-card class="flex-shrink-0 px-3 py-2" :rounded="0" flat border :style="{ borderLeft: '0' }">
    <div class="d-flex align-center">
      <v-btn
        class="active-chat-header__back-btn me-3"
        @click="() => $router.push('/')"
        size="small"
        variant="text"
        icon
        color="disabled"
      >
        <v-icon icon="mdi-arrow-left" size="26" />
      </v-btn>
      <div>
        <v-avatar size="46">
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" cover></v-img>
        </v-avatar>
      </div>
      <div class="ms-3">Вася</div>
    </div>
  </v-card>
</template>
