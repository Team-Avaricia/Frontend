<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { mainApi } from '@/services/api'
import type { TelegramStatusResponse, TelegramLinkResponse } from '@/types/api'

const loading = ref(true)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const userId = ref('')
const telegramStatus = ref<TelegramStatusResponse | null>(null)
const telegramLink = ref<TelegramLinkResponse | null>(null)
const isUnlinking = ref(false)

const isLinked = computed(() => telegramStatus.value?.isLinked ?? false)

const loadUserInfo = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      userId.value = userInfo.userId || ''
    } catch (e) {
      console.error('Error al parsear userInfo:', e)
    }
  }

  // Si no hay userId, intentar extraer del token
  if (!userId.value) {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const parts = token.split('.')
        if (parts.length === 3 && parts[1]) {
          const tokenPayload = JSON.parse(atob(parts[1]))
          userId.value = tokenPayload.sub || tokenPayload.userId || tokenPayload.id || ''
        }
      } catch (e) {
        console.error('Error al extraer userId del token:', e)
      }
    }
  }
}

const loadTelegramStatus = async () => {
  if (!userId.value) return

  try {
    const response = await mainApi.users.getTelegramStatus(userId.value)
    telegramStatus.value = response.data
  } catch (err) {
    console.error('Error al cargar estado de Telegram:', err)
  }
}

const getTelegramLink = async () => {
  if (!userId.value) {
    error.value = 'No se encontró el ID de usuario'
    return
  }

  loading.value = true
  error.value = null
  try {
    console.log('Obteniendo enlace de Telegram para userId:', userId.value)
    const response = await mainApi.users.getTelegramLink(userId.value)
    console.log('Respuesta del enlace de Telegram:', response.data)
    telegramLink.value = response.data

    if (!response.data?.linkUrl) {
      error.value = 'El servidor no devolvió un enlace válido'
      console.error('linkUrl no encontrado en la respuesta:', response.data)
    }
  } catch (err: any) {
    console.error('Error al obtener enlace de Telegram:', err)
    error.value = err?.response?.data?.message || err?.message || 'Error al obtener enlace de Telegram'
  } finally {
    loading.value = false
  }
}

const unlinkTelegram = async () => {
  if (!userId.value) return
  if (!confirm('¿Estás seguro de desvincular tu cuenta de Telegram?')) return

  isUnlinking.value = true
  error.value = null

  try {
    await mainApi.users.deleteTelegram(userId.value)
    telegramStatus.value = { isLinked: false }
    telegramLink.value = null
    successMessage.value = 'Telegram desvinculado exitosamente'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al desvincular Telegram'
  } finally {
    isUnlinking.value = false
  }
}

const copyLink = async () => {
  if (!telegramLink.value?.linkUrl) {
    error.value = 'No hay enlace disponible para copiar'
    return
  }

  try {
    await navigator.clipboard.writeText(telegramLink.value.linkUrl)
    successMessage.value = '✓ Enlace copiado al portapapeles'
    console.log('Enlace copiado:', telegramLink.value.linkUrl)
    setTimeout(() => {
      successMessage.value = null
    }, 2000)
  } catch (err) {
    console.error('Error al copiar enlace:', err)
    error.value = 'Error al copiar el enlace. Intenta seleccionarlo manualmente.'
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  loadUserInfo()
  if (userId.value) {
    await loadTelegramStatus()
    if (!isLinked.value) {
      await getTelegramLink()
    }
  }
  loading.value = false
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Configuración</h1>
            <p class="text-gray-500 text-sm">Gestiona tus integraciones y preferencias</p>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Cargando configuración...</p>
        </div>
      </div>

      <div v-else class="space-y-6">
        <!-- Telegram Integration -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-500 rounded-lg">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.327.015.093.034.306.019.472z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-800">Telegram</h2>
                <p class="text-sm text-gray-500">
                  Conecta tu cuenta de Telegram para recibir notificaciones
                </p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Linked State -->
            <div v-if="isLinked" class="space-y-4">
              <div class="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-green-800">Cuenta vinculada</p>
                  <p v-if="telegramStatus?.telegramUsername" class="text-sm text-green-600">
                    @{{ telegramStatus.telegramUsername }}
                  </p>
                  <p v-if="telegramStatus?.linkedAt" class="text-xs text-green-500">
                    Vinculado el {{ formatDate(telegramStatus.linkedAt) }}
                  </p>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-4">
                <h4 class="font-medium text-gray-700 mb-2">Funcionalidades disponibles:</h4>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Notificaciones de transacciones
                  </li>
                  <li class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Alertas de límites excedidos
                  </li>
                  <li class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Registrar gastos vía chat
                  </li>
                </ul>
              </div>

              <button
                @click="unlinkTelegram"
                :disabled="isUnlinking"
                class="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
              >
                <svg
                  v-if="isUnlinking"
                  class="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                  />
                </svg>
                {{ isUnlinking ? 'Desvinculando...' : 'Desvincular Telegram' }}
              </button>
            </div>

            <!-- Not Linked State -->
            <div v-else class="space-y-4">
              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-700">Cuenta no vinculada</p>
                  <p class="text-sm text-gray-500">
                    Vincula tu Telegram para recibir notificaciones
                  </p>
                </div>
              </div>

              <div v-if="telegramLink" class="bg-blue-50 rounded-xl p-4">
                <p class="text-sm text-blue-800 mb-3">
                  Haz clic en el siguiente enlace para vincular tu cuenta de Telegram:
                </p>

                <!-- Mostrar el enlace para debugging -->
                <div class="mb-3 p-2 bg-white rounded border border-blue-200">
                  <p class="text-xs text-gray-500 mb-1">Enlace de vinculación:</p>
                  <p class="text-xs font-mono text-blue-600 break-all">{{ telegramLink.linkUrl }}</p>
                </div>

                <div class="flex gap-2">
                  <a
                    :href="telegramLink.linkUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click="console.log('Click en enlace de Telegram:', telegramLink.linkUrl)"
                    class="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.099.154.232.17.327.015.093.034.306.019.472z"
                      />
                    </svg>
                    Abrir en Telegram
                  </a>
                  <button
                    @click="copyLink"
                    class="px-4 py-3 border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                    title="Copiar enlace"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                <p v-if="telegramLink.expiresAt" class="text-xs text-blue-600 mt-2">
                  El enlace expira el {{ formatDate(telegramLink.expiresAt) }}
                </p>
              </div>

              <button
                v-else
                @click="getTelegramLink"
                class="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Obtener enlace de vinculación
              </button>
            </div>
          </div>
        </div>

        <!-- More Settings Coming Soon -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center gap-3 opacity-50">
            <div class="p-2 bg-gray-200 rounded-lg">
              <svg
                class="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Más configuraciones</h2>
              <p class="text-sm text-gray-500">Próximamente más opciones de configuración</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
