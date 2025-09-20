<script setup lang="ts">
import Alert from '@/components/Alert.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <v-layout>
    <RouterView />
    <Alert />
  </v-layout>
</template>
