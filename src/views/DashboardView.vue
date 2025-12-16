﻿<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { authService } from '@/services/auth';
import { mainApi } from '@/services/api';
import type { Transaction, BalanceResponse } from '@/types/api';
import { useTransactionEvents, TransactionEvent } from '@/composables/useTransactionEvents';

const router = useRouter();
const { subscribe } = useTransactionEvents();

// Estado del usuario
const user = ref({
  name: 'Usuario',
  lastName: '',
  userName: 'usuario',
  email: 'demo@example.com',
  userId: ''
});

// Estado de carga
const loading = ref(true);
const error = ref<string | null>(null);

// Datos reales de transacciones
const transacciones = ref<Transaction[]>([]);
const balanceData = ref<BalanceResponse | null>(null);

// Filtrar ingresos y egresos
const ingresos = computed(() =>
  transacciones.value.filter(t => t.type === 'Income')
);

const egresos = computed(() =>
  transacciones.value.filter(t => t.type === 'Expense')
);

// Calculos basados en datos reales
const totalIngresos = computed(() => {
  if (balanceData.value) {
    return balanceData.value.totalIncome;
  }
  return ingresos.value.reduce((sum, item) => sum + item.amount, 0);
});

const totalEgresos = computed(() => {
  if (balanceData.value) {
    return balanceData.value.totalExpenses;
  }
  return egresos.value.reduce((sum, item) => sum + item.amount, 0);
});

const balance = computed(() => {
  if (balanceData.value) {
    return balanceData.value.currentBalance;
  }
  return totalIngresos.value - totalEgresos.value;
});

// Ultimas transacciones
const ultimasTransacciones = computed(() => {
  return [...transacciones.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

// Top gastos por categoria
const topGastos = computed(() => {
  const gastosPorCategoria = new Map<string, number>();

  egresos.value.forEach(egreso => {
    const categoria = egreso.category || 'Sin categoría';
    const actual = gastosPorCategoria.get(categoria) || 0;
    gastosPorCategoria.set(categoria, actual + egreso.amount);
  });

  return Array.from(gastosPorCategoria.entries())
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);
});

// Formateo de moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
};

// Formateo de fecha
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Cargar datos del usuario y transacciones
const loadUserData = async () => {
  try {
    // Verificar si el usuario esta autenticado
    const token = authService.getToken();
    if (!token) {
      console.warn('No hay token de autenticacion');
      router.push('/iniciar-sesion');
      return;
    }

    // Obtener informacion del usuario desde localStorage
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);

      // Actualizar informacion del usuario
      if (userInfo.userId) {
        user.value.userId = userInfo.userId;
      }

      if (userInfo.username) {
        const nameParts = userInfo.username.split(' ');
        user.value.name = nameParts[0] || userInfo.username;
        user.value.lastName = nameParts.slice(1).join(' ') || '';
      }

      if (userInfo.email) {
        user.value.email = userInfo.email;
        if (!userInfo.username) {
          user.value.name = userInfo.email.split('@')[0];
        }
      }

      user.value.userName = userInfo.username || user.value.email.split('@')[0];

      console.log('Usuario cargado:', user.value);
    } else {
      console.warn('No se encontro informacion del usuario en localStorage');
      // Intentar extraer del token
      try {
        const parts = token.split('.');
        if (parts.length === 3 && parts[1]) {
          const tokenPayload = JSON.parse(atob(parts[1]));
          user.value.userId = tokenPayload.sub || tokenPayload.userId || tokenPayload.id || '';
          if (tokenPayload.name) {
            const nameParts = tokenPayload.name.split(' ');
            user.value.name = nameParts[0];
            user.value.lastName = nameParts.slice(1).join(' ');
          }
          if (tokenPayload.email) {
            user.value.email = tokenPayload.email;
          }
        }
      } catch (e) {
        console.error('Error al decodificar token:', e);
      }
    }

    // Si tenemos userId, cargar datos reales
    if (user.value.userId) {
      console.log('Cargando datos para userId:', user.value.userId);

      // Cargar balance
      try {
        const balanceResponse = await mainApi.users.getBalance(user.value.userId);
        balanceData.value = balanceResponse.data;
        console.log('Balance cargado:', balanceData.value);
      } catch (err) {
        console.error('Error al cargar balance:', err);
      }

      // Cargar transacciones
      try {
        const transactionsResponse = await mainApi.transactions.getByUserId(user.value.userId);
        transacciones.value = transactionsResponse.data;
        console.log('Transacciones cargadas:', transacciones.value.length);
      } catch (err) {
        console.error('Error al cargar transacciones:', err);
      }
    } else {
      console.warn('No se pudo obtener userId, mostrando datos de ejemplo');
    }

  } catch (err) {
    console.error('Error al cargar datos del usuario:', err);
    error.value = 'Error al cargar los datos del usuario';
  } finally {
    loading.value = false;
  }
};

// Inicializar informacion al montar el componente
let unsubscribers: (() => void)[] = [];

onMounted(() => {
  loadUserData();

  // Suscribirse a eventos de transacciones
  unsubscribers = [
    subscribe(TransactionEvent.CREATED, () => {
      console.log('🔄 Dashboard - Recargando datos por transacción creada');
      loadUserData();
    }),
    subscribe(TransactionEvent.DELETED, () => {
      console.log('🔄 Dashboard - Recargando datos por transacción eliminada');
      loadUserData();
    }),
    subscribe(TransactionEvent.REFRESH, () => {
      console.log('🔄 Dashboard - Recargando datos por refresh solicitado');
      loadUserData();
    })
  ];
});

onUnmounted(() => {
  // Limpiar suscripciones
  unsubscribers.forEach(unsub => unsub());
});
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando datos...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-red-800">Error</h3>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Panel de Control</h1>
              <p class="text-gray-600 mt-2">
                Bienvenido, {{ user.name }} {{ user.lastName }} 👋
              </p>
            </div>
            <div class="flex gap-3">
              <RouterLink
                to="/ingresos"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Ingreso
              </RouterLink>
              <RouterLink
                to="/egresos"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
                Nuevo Egreso
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Cards principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Card de Balance -->
          <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white lg:col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium opacity-90">Balance Total</h3>
              <div class="p-3 bg-white/20 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p class="text-4xl font-bold mb-2">{{ formatCurrency(balance) }}</p>
            <p class="text-indigo-100 text-sm">Disponible este mes</p>
            <div class="mt-4 flex gap-4 text-sm">
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 bg-green-300 rounded-full"></span>
                Ingresos: {{ formatCurrency(totalIngresos) }}
              </span>
              <span class="flex items-center gap-1">
                <span class="w-2 h-2 bg-red-300 rounded-full"></span>
                Egresos: {{ formatCurrency(totalEgresos) }}
              </span>
            </div>
          </div>

          <!-- Card de Ingresos -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-green-100 rounded-lg">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <span class="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">+12.5%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalIngresos) }}</p>
            <p class="text-gray-500 text-sm mt-1">Total Ingresos</p>
            <RouterLink to="/ingresos" class="mt-4 text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
              Ver detalles
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>

          <!-- Card de Egresos -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-red-100 rounded-lg">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <span class="text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded">-8.3%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalEgresos) }}</p>
            <p class="text-gray-500 text-sm mt-1">Total Egresos</p>
            <RouterLink to="/egresos" class="mt-4 text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
              Ver detalles
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </RouterLink>
          </div>
        </div>

        <!-- Seccion de contenido principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Ultimas transacciones -->
          <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-900">Ultimas Transacciones</h3>
              <span class="text-sm text-gray-500">{{ formatDate(new Date().toISOString()) }}</span>
            </div>

            <!-- Sin transacciones -->
            <div v-if="!loading && ultimasTransacciones.length === 0" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">No hay transacciones aun</p>
              <p class="text-sm text-gray-400 mt-1">Crea tu primera transaccion para ver el historial aqui</p>
            </div>

            <!-- Lista de transacciones -->
            <div v-else class="space-y-4">
              <div
                v-for="transaccion in ultimasTransacciones"
                :key="transaccion.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <div
                    :class="[
                      'p-2 rounded-lg',
                      transaccion.type === 'Income' ? 'bg-green-100' : 'bg-red-100'
                    ]"
                  >
                    <svg
                      :class="[
                        'w-5 h-5',
                        transaccion.type === 'Income' ? 'text-green-600' : 'text-red-600'
                      ]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        v-if="transaccion.type === 'Income'"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                      <path
                        v-else
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ transaccion.description || 'Sin descripción' }}</p>
                    <p class="text-sm text-gray-500">{{ transaccion.category }} • {{ formatDate(transaccion.createdAt) }}</p>
                  </div>
                </div>
                <p
                  :class="[
                    'font-semibold',
                    transaccion.type === 'Income' ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ transaccion.type === 'Income' ? '+' : '-' }}{{ formatCurrency(transaccion.amount) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Panel lateral -->
          <div class="space-y-6">
            <!-- Perfil rapido -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {{ user.name.charAt(0).toUpperCase() }}{{ user.lastName ? user.lastName.charAt(0).toUpperCase() : '' }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900">{{ user.name }} {{ user.lastName }}</p>
                  <p class="text-sm text-gray-500">@{{ user.userName }}</p>
                </div>
              </div>
              <div class="border-t pt-4">
                <p class="text-sm text-gray-500 mb-1">Email</p>
                <p class="text-gray-900">{{ user.email }}</p>
              </div>
            </div>

            <!-- Resumen por categoria -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Gastos</h3>

              <!-- Sin gastos -->
              <div v-if="!loading && topGastos.length === 0" class="text-center py-8">
                <p class="text-gray-500 text-sm">No hay gastos registrados</p>
              </div>

              <!-- Lista de categorías -->
              <div v-else class="space-y-3">
                <div
                  v-for="(gasto, index) in topGastos"
                  :key="gasto.categoria"
                  class="flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'w-3 h-3 rounded-full',
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                      ]"
                    ></span>
                    <span class="text-gray-700">{{ gasto.categoria }}</span>
                  </div>
                  <span class="font-medium">{{ formatCurrency(gasto.total) }}</span>
                </div>
              </div>
            </div>

            <!-- Acceso rapido -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Acceso Rapido</h3>
              <div class="grid grid-cols-2 gap-3">
                <RouterLink
                  to="/ingresos"
                  class="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-center transition-colors shadow-sm"
                >
                  <svg class="w-6 h-6 mx-auto mb-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium">Ingresos</span>
                </RouterLink>
                <RouterLink
                  to="/egresos"
                  class="p-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-center transition-colors shadow-sm"
                >
                  <svg class="w-6 h-6 mx-auto mb-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="text-sm text-gray-700 font-medium">Egresos</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

