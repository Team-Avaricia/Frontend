<template>
  <div class="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-100">
          Procesando autenticacion...
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          Por favor espera mientras verificamos tu cuenta.
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">
          Error de autenticacion
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          {{ errorMessage }}
        </p>
        <button
          @click="goToLogin"
          class="mt-4 px-6 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Volver al inicio de sesion
        </button>
      </div>

      <!-- Success State -->
      <div v-else class="space-y-4">
        <div class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-green-600 dark:text-green-400">
          Autenticacion exitosa!
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          Bienvenido, {{ username }}
        </p>
        <p class="text-sm text-gray-400 dark:text-gray-500">
          Redirigiendo al panel de control...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authService } from '@/services/auth';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const isLoading = ref(true);
const error = ref(false);
const errorMessage = ref('');
const username = ref('');

const goToLogin = () => {
  router.push('/iniciar-sesion');
};

onMounted(async () => {
  try {
    // Obtener parametros de la URL
    const token = route.query.token as string;
    const usernameParam = route.query.username as string;
    const email = route.query.email as string;
    const provider = route.query.provider as string;

    // Verificar si hay un error en la URL
    const errorParam = route.query.error as string;
    if (errorParam) {
      throw new Error(errorParam);
    }

    // Verificar que tengamos el token
    if (!token) {
      throw new Error('No se recibio el token de autenticacion');
    }

    // Guardar el token
    authService.setToken(token);

    // Extraer userId del token JWT
    let userId = '';
    try {
      const parts = token.split('.');
      if (parts.length === 3 && parts[1]) {
        const tokenPayload = JSON.parse(atob(parts[1]));
        // El userId puede estar en diferentes campos dependiendo del backend
        userId = tokenPayload.sub || tokenPayload.userId || tokenPayload.id || '';
        console.log('UserId extraido del token:', userId);
      }
    } catch (e) {
      console.error('Error al extraer userId del token:', e);
    }

    // Guardar informacion del usuario si es necesario
    if (usernameParam || email) {
      const userInfo = {
        userId: userId,
        username: usernameParam || '',
        email: email || '',
        provider: provider || '',
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      console.log('UserInfo guardado:', userInfo);
    }

    username.value = usernameParam || email?.split('@')[0] || 'Usuario';

    // Mostrar exito
    isLoading.value = false;
    toast.success(`Bienvenido, ${username.value}!`);

    // Redirigir al dashboard despues de un breve delay
    setTimeout(() => {
      router.push('/panel-control');
    }, 1500);

  } catch (err) {
    console.error('Error en OAuth2 callback:', err);
    isLoading.value = false;
    error.value = true;
    errorMessage.value = err instanceof Error ? err.message : 'Ocurrio un error durante la autenticacion';
    toast.error(errorMessage.value);
  }
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

