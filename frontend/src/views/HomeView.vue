<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import { useClasseStore } from '@/stores/classe'
import { useNavigationStore } from '@/stores/navigation'
import { usePeriodoStore } from '@/stores/periodo'
import { useUsuarioStore } from '@/stores/usuario'
import { onMounted } from 'vue'

const usuarioStore = useUsuarioStore()
const navigationStore = useNavigationStore()
const periodoStore = usePeriodoStore()
const classeStore = useClasseStore()

onMounted(() => {
  usuarioStore.fetchUserInfo()
    .then(() => {
      periodoStore.fetchPeriodos()
      classeStore.fetchClasses()
    })
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
