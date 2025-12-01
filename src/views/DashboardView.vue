<script setup lang="ts">
import { ref, computed } from 'vue';

// Datos de ejemplo para el dashboard
const user = ref({
  name: 'Usuario',
  lastName: 'Demo',
  userName: 'usuario_demo',
  email: 'demo@example.com'
});

// Datos de ejemplo para ingresos
const ingresos = ref([
  { id: 1, descripcion: 'Salario mensual', monto: 2500.00, fecha: '2025-11-01', categoria: 'Salario' },
  { id: 2, descripcion: 'Freelance proyecto web', monto: 800.00, fecha: '2025-11-10', categoria: 'Freelance' },
  { id: 3, descripcion: 'Dividendos', monto: 150.00, fecha: '2025-11-15', categoria: 'Inversiones' },
  { id: 4, descripcion: 'Venta de artículos', monto: 200.00, fecha: '2025-11-20', categoria: 'Ventas' },
]);

// Datos de ejemplo para egresos
const egresos = ref([
  { id: 1, descripcion: 'Alquiler', monto: 800.00, fecha: '2025-11-01', categoria: 'Vivienda' },
  { id: 2, descripcion: 'Supermercado', monto: 350.00, fecha: '2025-11-05', categoria: 'Alimentación' },
  { id: 3, descripcion: 'Servicios (luz, agua, gas)', monto: 150.00, fecha: '2025-11-10', categoria: 'Servicios' },
  { id: 4, descripcion: 'Transporte', monto: 100.00, fecha: '2025-11-12', categoria: 'Transporte' },
  { id: 5, descripcion: 'Entretenimiento', monto: 80.00, fecha: '2025-11-18', categoria: 'Ocio' },
]);

// Cálculos
const totalIngresos = computed(() => ingresos.value.reduce((sum, item) => sum + item.monto, 0));
const totalEgresos = computed(() => egresos.value.reduce((sum, item) => sum + item.monto, 0));
const balance = computed(() => totalIngresos.value - totalEgresos.value);

// Últimas transacciones combinadas
const ultimasTransacciones = computed(() => {
  const todas = [
    ...ingresos.value.map(i => ({ ...i, tipo: 'ingreso' as const })),
    ...egresos.value.map(e => ({ ...e, tipo: 'egreso' as const }))
  ];
  return todas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 5);
});

// Formateo de moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Formateo de fecha
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
};
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
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

      <!-- Sección de contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Últimas transacciones -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Últimas Transacciones</h3>
            <span class="text-sm text-gray-500">Noviembre 2025</span>
          </div>
          <div class="space-y-4">
            <div
              v-for="transaccion in ultimasTransacciones"
              :key="`${transaccion.tipo}-${transaccion.id}`"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  :class="[
                    'p-2 rounded-lg',
                    transaccion.tipo === 'ingreso' ? 'bg-green-100' : 'bg-red-100'
                  ]"
                >
                  <svg
                    :class="[
                      'w-5 h-5',
                      transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      v-if="transaccion.tipo === 'ingreso'"
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
                  <p class="font-medium text-gray-900">{{ transaccion.descripcion }}</p>
                  <p class="text-sm text-gray-500">{{ transaccion.categoria }} • {{ formatDate(transaccion.fecha) }}</p>
                </div>
              </div>
              <p
                :class="[
                  'font-semibold',
                  transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ transaccion.tipo === 'ingreso' ? '+' : '-' }}{{ formatCurrency(transaccion.monto) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="space-y-6">
          <!-- Perfil rápido -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {{ user.name.charAt(0) }}{{ user.lastName.charAt(0) }}
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

          <!-- Resumen por categoría -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Gastos</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span class="text-gray-700">Vivienda</span>
                </div>
                <span class="font-medium">{{ formatCurrency(800) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span class="text-gray-700">Alimentación</span>
                </div>
                <span class="font-medium">{{ formatCurrency(350) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span class="text-gray-700">Servicios</span>
                </div>
                <span class="font-medium">{{ formatCurrency(150) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span class="text-gray-700">Transporte</span>
                </div>
                <span class="font-medium">{{ formatCurrency(100) }}</span>
              </div>
            </div>
          </div>

          <!-- Acceso rápido -->
          <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6 text-white">
            <h3 class="text-lg font-semibold mb-4">Acceso Rápido</h3>
            <div class="grid grid-cols-2 gap-3">
              <RouterLink
                to="/ingresos"
                class="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-center transition-colors"
              >
                <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">Ingresos</span>
              </RouterLink>
              <RouterLink
                to="/egresos"
                class="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-center transition-colors"
              >
                <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="text-sm">Egresos</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Nota informativa -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <h4 class="font-semibold text-blue-800">Modo Demo</h4>
            <p class="text-sm text-blue-700 mt-1">
              Esta es una vista de demostración con datos de ejemplo. Los datos mostrados son simulados para propósitos de desarrollo.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
