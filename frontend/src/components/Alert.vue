<script setup lang="ts">
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()
</script>

<template>
  <v-snackbar
    v-model="alertStore.alertOpen"
    :text="alertStore.alertMessage"
    :timeout="-1"
  >
    <template v-slot:actions>
      <v-btn
        color="blue"
        variant="text"
        icon="mdi-window-close"
        @click="alertStore.closeAlert"
      />
    </template>
  </v-snackbar>
</template>