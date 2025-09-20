<script setup lang="ts">
import { useUsuarioStore } from '@/stores/usuario'
import { ref } from 'vue'

const usuarioStore = useUsuarioStore()

const drawerOpen = ref(false)

function toggle() {
  drawerOpen.value = !drawerOpen.value
}
</script>

<template>
  <v-app-bar elevation="2" color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggle" />
    </template>
    <v-app-bar-title>EBD</v-app-bar-title>
  </v-app-bar>

  <v-navigation-drawer v-model="drawerOpen" temporary>
    <v-list>
      <v-list-item>
        {{ usuarioStore.nome }}
      </v-list-item>

      <v-divider></v-divider>
      
      <v-list-item
        color="primary"
        append-icon="mdi-ticket"
      >
        Ticket
      </v-list-item>
      <v-list-item
        color="primary"
        append-icon="mdi-cart"
      >
        Cart
      </v-list-item>
      <v-list-item
        color="primary"
        append-icon="mdi-silverware-fork-knife"
      >
        Fork & Knife
      </v-list-item>
      
      <v-divider></v-divider>

      <v-list-item
        append-icon="mdi-logout"
        class="logout"
      >
        Logout
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-list {
  height: calc(100dvh - 64px);
}

.logout {
  color: red;
}
</style>