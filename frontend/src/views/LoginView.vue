<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import { useNavigationStore } from '@/stores/navigation'
import { getToken } from '@/utils/localStorage'

const alertStore = useAlertStore()
const authStore = useAuthStore()
const navigationStore = useNavigationStore()

const email = ref('')
const code = ref('')
const loading = ref(false)
const step = ref<'generate' | 'verify'>('generate')

async function generateStep() {
  try {
    await authStore.generateAuthCode(email.value.trim())
    
    step.value = 'verify'
  } catch (err: any) {
    let message = 'Ocorreu algum problema. Tente novamente'
  
    if (err.status === 400) {
      message = 'Verifique o email informado'
    }
  
    alertStore.showAlert(message)
  } finally {
    loading.value = false
  }
}

async function verifyStep() {
  try {
    await authStore.verifyAuthCode(code.value.trim())

    navigationStore.goToHome()
  } catch {
    alertStore.showAlert('Verifique o código inserido e tente novamente')
  } finally {
    loading.value = false
  }
}

function click() {
  if (!email.value) {
    return
  }

  loading.value = true

  if (step.value === 'generate') {
    generateStep()
  } else {
    verifyStep()
  }
}

function reset() {
  email.value = ''
  step.value = 'generate'
}

function validateEmail(value: string) {
  return !!value && value.indexOf('@') > 0 || 'Preencha seu email corretamente'
}

function validateCode(value: string) {
  return !!value && /^\d{6}$/g.test(value) || 'Preencha o código de 6 dígitos'
}

onMounted(() => {
  if (getToken()) {
    navigationStore.goToHome()
  }
})
</script>

<template>
  <v-container class="h-screen">
    <v-card elevation="4" rounded border>
      <v-card-title>EBD</v-card-title>
      <v-card-text>
        <template v-if="step === 'generate'">
          <p>Acesse sua conta através do seu email.</p>
          <v-text-field
            label="Email"
            variant="outlined"
            validate-on="blur"
            :rules="[validateEmail]"
            v-model="email"
          ></v-text-field>
        </template>
        <template v-else>
          <p>Informe o código enviado para {{ email }}</p>
          <div class="secondary-actions">
            <v-btn color="primary" variant="text" @click="generateStep">Reenviar código</v-btn>
            <v-btn color="primary" variant="text" @click="reset">Trocar email</v-btn>
          </div>
          <v-text-field
            label="Código"
            variant="outlined"
            validate-on="blur"
            :rules="[validateCode]"
            v-model="code"
            clearable
          ></v-text-field>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          class="bg-primary"
          :loading="loading"
          @click="click"
        >CONTINUAR</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
}

.v-card-title {
  padding-top: 16px;
  font-size: 24px;
  text-align: center;
}

.v-card-text {
  padding: 0 16px;
  font-size: 18px;
  line-height: 28px !important;
  text-align: center;
}

.v-card-actions {
  padding: 16px;
  justify-content: center;
}

.v-input {
  margin: 16px 0 0;
}

.secondary-actions {
  display: flex;
  justify-content: space-between;
  margin: 8px 0 0;

  :deep(.v-btn__content) {
    text-transform: none;
  }
}
</style>
