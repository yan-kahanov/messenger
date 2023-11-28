<template>
    <v-card class="flex-shrink-0 px-1" :rounded="0" flat border :style="{ borderLeft: '0' }">
        <div class="d-flex align-center">
            <v-btn icon variant="text" color="disabled">
                <v-icon icon="mdi-paperclip" size="30" />
            </v-btn>
            <v-textarea rows="1" variant="solo" placeholder="Написать сообщение..." flat hide-details no-resize></v-textarea>
            <v-btn icon variant="text" color="disabled">
                <v-icon icon="mdi-emoticon-happy-outline" size="30" />
            </v-btn>
            <v-btn icon variant="text" color="primary">
                <v-icon icon="mdi-send" size="30" />
            </v-btn>
        </div>
    </v-card>
</template>