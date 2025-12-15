```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mainApi } from '@/services/api'
import type { Transaction, CategorySummaryItem, TransactionSearchParams } from '@/types/api'

const loading = ref(true)
const error = ref<string | null>(null)
const userId = ref('')
const searchResults = ref<Transaction[]>([])
const categorySummary = ref<CategorySummaryItem[]>([])
const grandTotal = ref(0)

// Search filters
const searchQuery = ref('')
const selectedCategory = ref('')
const startDate = ref('')
const endDate = ref('')

const categories = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Servicios',
  'Compras',
  'Otros',
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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
}

const loadCategorySummary = async () => {
  if (!userId.value) return

  try {
    const response = await mainApi.transactions.getCategorySummary(userId.value)
    categorySummary.value = response.data.data
    grandTotal.value = response.data.grandTotal
  } catch (err) {
    console.error('Error al cargar resumen por categoría:', err)
  }
}

const searchTransactions = async () => {
  if (!userId.value) return

  loading.value = true
  error.value = null

  try {
    const params: TransactionSearchParams = {}
    if (searchQuery.value) params.query = searchQuery.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value

    const response = await mainApi.transactions.search(userId.value, params)
    searchResults.value = response.data.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al buscar transacciones'
  } finally {
    loading.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  startDate.value = ''
  endDate.value = ''
  searchResults.value = []
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Alimentación: 'bg-orange-500',
    Transporte: 'bg-blue-500',
    Entretenimiento: 'bg-purple-500',
    Salud: 'bg-green-500',
    Educación: 'bg-yellow-500',
    Servicios: 'bg-cyan-500',
    Compras: 'bg-pink-500',
    Otros: 'bg-gray-500',
  }
  return colors[category] || 'bg-gray-500'
}

onMounted(async () => {
  loadUserInfo()
  await loadCategorySummary()
  loading.value = false
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Reportes</h1>
            <p class="text-gray-500 text-sm">Analiza tus transacciones y gastos por categoría</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Cargando reportes...</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Summary -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            Gastos por Categoría
          </h2>

          <div v-if="categorySummary.length === 0" class="text-center py-8 text-gray-500">
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No hay datos de categorías disponibles</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="item in categorySummary" :key="item.category" class="relative">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-700">{{ item.category }}</span>
                <span class="text-sm text-gray-600">{{ formatCurrency(item.totalAmount) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  :class="getCategoryColor(item.category)"
                  class="h-3 rounded-full transition-all duration-500"
                  :style="{ width: `${item.percentage}%` }"
                ></div>
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-xs text-gray-500">{{ item.transactionCount }} transacciones</span>
                <span class="text-xs font-medium text-gray-600"
                  >{{ item.percentage.toFixed(1) }}%</span
                >
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-800">Total</span>
                <span class="font-bold text-lg text-indigo-600">{{
                  formatCurrency(grandTotal)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Search -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar Transacciones
          </h2>

          <!-- Search Form -->
          <div class="space-y-4 mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por descripción..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Desde</label>
                <input
                  v-model="startDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Hasta</label>
                <input
                  v-model="endDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="searchTransactions"
                class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Buscar
              </button>
              <button
                @click="clearFilters"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="transaction in searchResults"
              :key="transaction.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    transaction.type === 'Income' ? 'bg-green-100' : 'bg-red-100',
                  ]"
                >
                  <svg
                    :class="[
                      'w-4 h-4',
                      transaction.type === 'Income' ? 'text-green-600' : 'text-red-600',
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="transaction.type === 'Income'"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                    <path
                      v-else
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">
                    {{ transaction.description || transaction.category }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ transaction.category }} • {{ formatDate(transaction.createdAt) }}
                  </p>
                </div>
              </div>
              <span
                :class="[
                  'font-semibold',
                  transaction.type === 'Income' ? 'text-green-600' : 'text-red-600',
                ]"
              >
                {{ transaction.type === 'Income' ? '+' : '-'
                }}{{ formatCurrency(transaction.amount) }}
              </span>
            </div>
          </div>

          <div v-else-if="!loading" class="text-center py-8 text-gray-500">
            <svg
              class="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p>Usa los filtros para buscar transacciones</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
