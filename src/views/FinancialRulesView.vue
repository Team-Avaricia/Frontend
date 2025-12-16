<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mainApi } from '@/services/api'
import type {
  FinancialRule,
  RuleProgressResponse,
  CreateFinancialRuleRequest,
  RuleType,
  RulePeriod,
} from '@/types/api'

const loading = ref(true)
const error = ref<string | null>(null)
const userId = ref('')
const rules = ref<FinancialRule[]>([])
const rulesProgress = ref<RuleProgressResponse[]>([])
const showCreateModal = ref(false)

// Form para crear regla
const newRule = ref({
  type: 'SpendingLimit' as RuleType,
  category: '',
  amountLimit: 0,
  period: 'Monthly' as RulePeriod,
})

const ruleTypes = [
  { value: 'SpendingLimit', label: 'Límite de Gasto' },
  { value: 'SavingsGoal', label: 'Meta de Ahorro' },
  { value: 'CategoryBudget', label: 'Presupuesto por Categoría' },
]

const periods = [
  { value: 'Daily', label: 'Diario' },
  { value: 'Weekly', label: 'Semanal' },
  { value: 'Monthly', label: 'Mensual' },
  { value: 'Yearly', label: 'Anual' },
]

const categories = [
  // Categorías de Ingresos
  'Salario',
  'Freelance',
  'Inversiones',
  'Ventas',
  'Regalos',
  'Reembolsos',
  // Categorías de Gastos
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

const loadRules = async () => {
  if (!userId.value) return

  try {
    const response = await mainApi.financialRules.getByUserId(userId.value)
    rules.value = response.data
  } catch (err: unknown) {
    console.error('Error al cargar reglas:', err)
    const axiosError = err as { response?: { status?: number; data?: { message?: string } } }
    if (axiosError.response?.status === 400) {
      error.value =
        'Error de autenticación con el servidor. Por favor, cierra sesión y vuelve a iniciar.'
    } else {
      error.value = axiosError.response?.data?.message || 'Error al cargar reglas financieras'
    }
  }
}

const loadProgress = async () => {
  if (!userId.value) return

  try {
    const response = await mainApi.financialRules.getUserProgress(userId.value)
    rulesProgress.value = response.data
  } catch (err: unknown) {
    console.error('Error al cargar progreso:', err)
    // No mostrar error aquí, solo log - el progreso es opcional
  }
}

const getProgressForRule = (ruleId: string) => {
  return rulesProgress.value.find((p) => p.ruleId === ruleId)
}

const createRule = async () => {
  if (!userId.value) return

  try {
    const data: CreateFinancialRuleRequest = {
      userId: userId.value,
      type: newRule.value.type,
      amountLimit: newRule.value.amountLimit,
      period: newRule.value.period,
    }

    if (newRule.value.category) {
      data.category = newRule.value.category
    }

    await mainApi.financialRules.create(data)
    showCreateModal.value = false
    newRule.value = {
      type: 'SpendingLimit' as RuleType,
      category: '',
      amountLimit: 0,
      period: 'Monthly' as RulePeriod,
    }
    await loadRules()
    await loadProgress()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al crear regla'
  }
}

const deleteRule = async (ruleId: string) => {
  if (!confirm('¿Estás seguro de eliminar esta regla?')) return

  try {
    await mainApi.financialRules.delete(ruleId)
    await loadRules()
    await loadProgress()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al eliminar regla'
  }
}

const deactivateRule = async (ruleId: string) => {
  try {
    await mainApi.financialRules.deactivate(ruleId)
    await loadRules()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al desactivar regla'
  }
}

const getRuleTypeLabel = (type: string) => {
  const found = ruleTypes.find((t) => t.value === type)
  return found ? found.label : type
}

const getPeriodLabel = (period: string) => {
  const found = periods.find((p) => p.value === period)
  return found ? found.label : period
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 80) return 'bg-yellow-500'
  return 'bg-green-500'
}

onMounted(async () => {
  loadUserInfo()
  if (userId.value) {
    await loadRules()
    await loadProgress()
  }
  loading.value = false
})
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Reglas Financieras</h1>
              <p class="text-gray-500 text-sm">Establece límites y metas para tus finanzas</p>
            </div>
          </div>
          <button
            @click="showCreateModal = true"
            class="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-medium shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Regla
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Cargando reglas...</p>
        </div>
      </div>

      <!-- Rules Grid -->
      <div
        v-else-if="rules.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="rule in rules"
          :key="rule.id"
          class="bg-white rounded-xl shadow-lg p-6 border-l-4"
          :class="rule.isActive ? 'border-amber-500' : 'border-gray-300'"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <span
                class="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2"
                :class="rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ rule.isActive ? 'Activa' : 'Inactiva' }}
              </span>
              <h3 class="font-semibold text-gray-800">{{ getRuleTypeLabel(rule.type) }}</h3>
              <p v-if="rule.category" class="text-sm text-gray-500">{{ rule.category }}</p>
            </div>
            <div class="flex gap-1">
              <button
                v-if="rule.isActive"
                @click="deactivateRule(rule.id)"
                class="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                title="Desactivar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                @click="deleteRule(rule.id)"
                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500"
                >Límite {{ getPeriodLabel(rule.period).toLowerCase() }}</span
              >
              <span class="font-semibold text-gray-800">{{
                formatCurrency(rule.amountLimit)
              }}</span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="getProgressForRule(rule.id)" class="mt-4">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-500">Progreso</span>
              <span
                :class="
                  getProgressForRule(rule.id)?.isOverBudget
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-600'
                "
              >
                {{ (getProgressForRule(rule.id)?.percentUsed || 0).toFixed(0) }}%
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="getProgressColor(getProgressForRule(rule.id)?.percentUsed || 0)"
                class="h-2 rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min(getProgressForRule(rule.id)?.percentUsed || 0, 100)}%`,
                }"
              ></div>
            </div>
            <div class="flex justify-between text-xs mt-2">
              <span class="text-gray-500">
                Gastado: {{ formatCurrency(getProgressForRule(rule.id)?.spent || 0) }}
              </span>
              <span class="text-gray-500">
                Disponible: {{ formatCurrency(getProgressForRule(rule.id)?.remaining || 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-xl shadow-lg p-12 text-center">
        <svg
          class="w-16 h-16 mx-auto mb-4 text-gray-300"
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
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No tienes reglas financieras</h3>
        <p class="text-gray-500 mb-4">Crea tu primera regla para controlar tus gastos</p>
        <button
          @click="showCreateModal = true"
          class="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-medium"
        >
          Crear Regla
        </button>
      </div>

      <!-- Create Modal -->
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-800">Nueva Regla Financiera</h2>
            <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form @submit.prevent="createRule" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Regla</label>
              <select
                v-model="newRule.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option v-for="type in ruleTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Categoría (opcional)</label
              >
              <select
                v-model="newRule.category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Límite</label>
              <input
                v-model.number="newRule.amountLimit"
                type="number"
                min="0"
                step="1000"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                v-model="newRule.period"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option v-for="period in periods" :key="period.value" :value="period.value">
                  {{ period.label }}
                </option>
              </select>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="showCreateModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all font-medium"
              >
                Crear Regla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
