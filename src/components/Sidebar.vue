<template>
  <aside
    class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out z-40 shadow-lg"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <div class="flex flex-col h-full py-4">
      <!-- User Profile Card -->
      <div class="px-4 mb-4">
        <div
          class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-md"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/50"
            >
              <span class="text-lg font-bold">{{ userInitial }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm truncate">{{ userName }}</p>
              <p class="text-xs text-purple-100 truncate">@{{ userHandle }}</p>
            </div>
          </div>
          <div
            class="flex items-center justify-between text-xs bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm"
          >
            <span class="text-purple-100">Balance</span>
            <span v-if="loading" class="font-bold animate-pulse">...</span>
            <span v-else class="font-bold">{{ formattedBalance }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="px-4 mb-4">
        <div class="grid grid-cols-2 gap-2">
          <div
            class="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800"
          >
            <div class="flex items-center gap-1.5">
              <div class="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
                <svg
                  class="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </div>
              <div>
                <p class="text-[10px] text-green-600 dark:text-green-400 font-medium">Ingresos</p>
                <p
                  v-if="loading"
                  class="text-xs font-bold text-green-700 dark:text-green-300 animate-pulse"
                >
                  ...
                </p>
                <p v-else class="text-xs font-bold text-green-700 dark:text-green-300">
                  {{ formattedIncome }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="bg-red-50 dark:bg-red-900/20 rounded-lg p-2 border border-red-200 dark:border-red-800"
          >
            <div class="flex items-center gap-1.5">
              <div class="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
                <svg
                  class="w-3.5 h-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
              <div>
                <p class="text-[10px] text-red-600 dark:text-red-400 font-medium">Egresos</p>
                <p
                  v-if="loading"
                  class="text-xs font-bold text-red-700 dark:text-red-300 animate-pulse"
                >
                  ...
                </p>
                <p v-else class="text-xs font-bold text-red-700 dark:text-red-300">
                  {{ formattedExpense }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Label -->
      <div class="px-4 mb-2">
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Navegación
        </h3>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
        <RouterLink
          to="/panel-control"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="
            isActive('/panel-control')
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-1'
          "
        >
          <div
            class="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            :class="
              isActive('/panel-control')
                ? 'bg-white/20'
                : 'bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110'
            "
          >
            <svg
              class="w-4 h-4"
              :class="
                isActive('/panel-control') ? 'text-white' : 'text-purple-600 dark:text-purple-400'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <span class="font-medium text-sm">Panel de Control</span>
          <div
            v-if="isActive('/panel-control')"
            class="absolute right-0 w-1 h-8 bg-white rounded-l-full"
          ></div>
        </RouterLink>

        <RouterLink
          to="/ingresos"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="
            isActive('/ingresos')
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-1'
          "
        >
          <div
            class="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            :class="
              isActive('/ingresos')
                ? 'bg-white/20'
                : 'bg-green-100 dark:bg-green-900/30 group-hover:scale-110'
            "
          >
            <svg
              class="w-4 h-4"
              :class="isActive('/ingresos') ? 'text-white' : 'text-green-600 dark:text-green-400'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          </div>
          <span class="font-medium text-sm">Ingresos</span>
          <div
            v-if="isActive('/ingresos')"
            class="absolute right-0 w-1 h-8 bg-white rounded-l-full"
          ></div>
        </RouterLink>

        <RouterLink
          to="/egresos"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="
            isActive('/egresos')
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-1'
          "
        >
          <div
            class="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            :class="
              isActive('/egresos')
                ? 'bg-white/20'
                : 'bg-red-100 dark:bg-red-900/30 group-hover:scale-110'
            "
          >
            <svg
              class="w-4 h-4"
              :class="isActive('/egresos') ? 'text-white' : 'text-red-600 dark:text-red-400'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
          </div>
          <span class="font-medium text-sm">Egresos</span>
          <div
            v-if="isActive('/egresos')"
            class="absolute right-0 w-1 h-8 bg-white rounded-l-full"
          ></div>
        </RouterLink>

        <!-- Divider -->
        <div
          class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-3"
        ></div>

        <!-- Additional Links -->
        <RouterLink
          to="/reportes"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="
            isActive('/reportes')
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-1'
          "
        >
          <div
            class="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            :class="
              isActive('/reportes')
                ? 'bg-white/20'
                : 'bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110'
            "
          >
            <svg
              class="w-4 h-4"
              :class="isActive('/reportes') ? 'text-white' : 'text-blue-600 dark:text-blue-400'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <span class="font-medium text-sm">Reportes</span>
          <div
            v-if="isActive('/reportes')"
            class="absolute right-0 w-1 h-8 bg-white rounded-l-full"
          ></div>
        </RouterLink>

        <RouterLink
          to="/reglas-financieras"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="
            isActive('/reglas-financieras')
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-1'
          "
        >
          <div
            class="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            :class="
              isActive('/reglas-financieras')
                ? 'bg-white/20'
                : 'bg-amber-100 dark:bg-amber-900/30 group-hover:scale-110'
            "
          >
            <svg
              class="w-4 h-4"
              :class="
                isActive('/reglas-financieras')
                  ? 'text-white'
                  : 'text-amber-600 dark:text-amber-400'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span class="font-medium text-sm">Reglas Financieras</span>
          <div
            v-if="isActive('/reglas-financieras')"
            class="absolute right-0 w-1 h-8 bg-white rounded-l-full"
          ></div>
        </RouterLink>

        <RouterLink
          to="/configuracion"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
          :class="
            isActive('/configuracion')
              ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-md shadow-gray-500/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:translate-x-1'
          "
        >
          <div
            class="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
            :class="
              isActive('/configuracion')
                ? 'bg-white/20'
                : 'bg-gray-100 dark:bg-gray-700/50 group-hover:scale-110'
            "
          >
            <svg
              class="w-4 h-4"
              :class="
                isActive('/configuracion') ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
          <span class="font-medium text-sm">Configuración</span>
          <div
            v-if="isActive('/configuracion')"
            class="absolute right-0 w-1 h-8 bg-white rounded-l-full"
          ></div>
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="px-4 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <!-- Help Button -->
        <button
          class="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all group"
        >
          <svg
            class="w-4 h-4 group-hover:rotate-12 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="font-medium">Centro de Ayuda</span>
        </button>

        <!-- Version Info -->
        <div
          class="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
            >
              <span class="text-white font-bold text-[10px]">RW</span>
            </div>
            <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Riwi Wallet</span>
          </div>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 font-mono">v1.0</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
  ></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { authService } from '@/services/auth'
import { mainApi } from '@/services/api'
import { useTransactionEvents, TransactionEvent } from '@/composables/useTransactionEvents'

interface Props {
  isOpen: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const userName = ref('Usuario')
const userEmail = ref('')
const userId = ref('')
const balance = ref(0)
const totalIncome = ref(0)
const totalExpense = ref(0)
const loading = ref(true)

const { subscribe } = useTransactionEvents()

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase()
})

const userHandle = computed(() => {
  return userEmail.value.split('@')[0] || 'usuario'
})

const formattedBalance = computed(() => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(balance.value)
})

const formattedIncome = computed(() => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalIncome.value)
})

const formattedExpense = computed(() => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalExpense.value)
})

const isActive = (path: string) => {
  return route.path === path
}

const closeSidebar = () => {
  emit('close')
}

const loadUserInfo = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr)
      userName.value = userInfo.username || userInfo.email?.split('@')[0] || 'Usuario'
      userEmail.value = userInfo.email || ''
      userId.value = userInfo.userId || ''

      console.log('Sidebar - Usuario cargado:', { userName: userName.value, userId: userId.value })
    } catch (e) {
      console.error('Error al parsear userInfo:', e)
    }
  }
}

const loadBalance = async () => {
  if (!userId.value) {
    console.warn('Sidebar - No hay userId disponible')
    loading.value = false
    return
  }

  try {
    const token = authService.getToken()
    if (!token) {
      console.warn('Sidebar - No hay token de autenticación')
      loading.value = false
      return
    }

    console.log('Sidebar - Cargando balance para userId:', userId.value)
    const balanceResponse = await mainApi.users.getBalance(userId.value)
    balance.value = balanceResponse.data.currentBalance
    totalIncome.value = balanceResponse.data.totalIncome
    totalExpense.value = balanceResponse.data.totalExpenses
    console.log('Sidebar - Balance cargado:', {
      balance: balance.value,
      income: totalIncome.value,
      expense: totalExpense.value,
    })
  } catch (error) {
    console.error('Sidebar - Error al cargar balance:', error)
  } finally {
    loading.value = false
  }
}

// Escuchar eventos de transacciones
let unsubscribers: (() => void)[] = []

onMounted(() => {
  loadUserInfo()
  loadBalance()

  // Suscribirse a eventos de transacciones
  unsubscribers = [
    subscribe(TransactionEvent.CREATED, () => {
      console.log('🔄 Sidebar - Recargando datos por transacción creada')
      loadBalance()
    }),
    subscribe(TransactionEvent.DELETED, () => {
      console.log('🔄 Sidebar - Recargando datos por transacción eliminada')
      loadBalance()
    }),
    subscribe(TransactionEvent.REFRESH, () => {
      console.log('🔄 Sidebar - Recargando datos por refresh solicitado')
      loadBalance()
    }),
  ]
})

onUnmounted(() => {
  // Limpiar suscripciones
  unsubscribers.forEach((unsub) => unsub())
})
</script>
