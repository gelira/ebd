<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import { useUsuarioStore } from '@/stores/usuario'
import { onMounted } from 'vue'

const usuarioStore = useUsuarioStore()

onMounted(() => {
  usuarioStore.fetchUserInfo()
})
</script>

<template>
  <AppBar />
  <v-container class="mt-16">
    <h1>Home</h1>
  </v-container>
</template>
