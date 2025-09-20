<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUsuarioStore } from '@/stores/usuario'
import { onMounted } from 'vue'

const usuarioStore = useUsuarioStore()
const navigationStore = useNavigationStore()

onMounted(() => {
  usuarioStore.fetchUserInfo()
    .catch(() => {
      navigationStore.goToLogin()
    })
})
</script>

<template>
  <AppBar />
  <v-container class="mt-16">
    <h1>Home {{ usuarioStore.nome }}</h1>
  </v-container>
</template>
