<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';
import { api } from '@/services/api';

const router = useRouter();
const user = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.push('/iniciar-sesion');
    return;
  }

  try {
    const response = await api.get('/Auth/me');
    user.value = response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
  } finally {
    loading.value = false;
  }
});

const handleLogout = () => {
  authService.removeToken();
  router.push('/iniciar-sesion');
};
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p v-if="!loading && user" class="text-gray-600 mt-2">
              Bienvenido, {{ user.name }} {{ user.lastName }}
            </p>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-gray-600">Cargando información...</p>
      </div>

      <!-- User Info -->
      <div v-else-if="user" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Card de Perfil -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-4">
            <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-center mb-2">Perfil de Usuario</h3>
          <div class="space-y-2 text-sm">
            <p><span class="font-semibold">Nombre:</span> {{ user.name }} {{ user.lastName }}</p>
            <p><span class="font-semibold">Usuario:</span> @{{ user.userName }}</p>
            <p><span class="font-semibold">Email:</span> {{ user.email }}</p>
            <p><span class="font-semibold">ID:</span> {{ user.id }}</p>
          </div>
        </div>

        <!-- Card de Ingresos -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Ingresos</h3>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold mb-2">$0.00</p>
          <p class="text-green-100">Total de ingresos</p>
          <RouterLink to="/ingresos" class="mt-4 block text-center bg-white/20 hover:bg-white/30 rounded py-2 transition-colors">
            Ver detalles →
          </RouterLink>
        </div>

        <!-- Card de Egresos -->
        <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Egresos</h3>
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p class="text-3xl font-bold mb-2">$0.00</p>
          <p class="text-red-100">Total de egresos</p>
          <RouterLink to="/egresos" class="mt-4 block text-center bg-white/20 hover:bg-white/30 rounded py-2 transition-colors">
            Ver detalles →
          </RouterLink>
        </div>

        <!-- Card de Balance -->
        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white md:col-span-2 lg:col-span-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-semibold">Balance Total</h3>
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-5xl font-bold mb-2">$0.00</p>
          <p class="text-indigo-100">Tu saldo actual</p>
        </div>
      </div>

      <!-- Estado del Mock API -->
      <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h4 class="font-semibold text-yellow-800">Modo de Desarrollo - Mock API Activo</h4>
            <p class="text-sm text-yellow-700 mt-1">
              Estás usando datos simulados. Cuando el backend esté listo, cambia <code class="bg-yellow-100 px-1 rounded">USE_MOCK_API</code> a <code class="bg-yellow-100 px-1 rounded">false</code> en <code class="bg-yellow-100 px-1 rounded">src/services/mockApi.ts</code>
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
