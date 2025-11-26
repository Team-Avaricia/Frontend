<template>
  <div class="w-full flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Inicia Sesión</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          ¿Aún no tienes una cuenta?
          <RouterLink to="/registrarse" class="font-medium text-indigo-600 hover:text-indigo-500">
            Regístrate gratis
          </RouterLink>
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="identifier" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo Electrónico o Nombre de Usuario
          </label>
          <input
            id="identifier"
            v-model="identifier"
            type="text"
            required
            placeholder="tu@correo.com o tu usuario"
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <RouterLink to="/recuperar-contrasena" class="text-sm text-indigo-600 hover:text-indigo-500">
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </div>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Toggle password visibility"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '@/services/api';
import { authService } from '@/services/auth';

const router = useRouter();
const toast = useToast();

// Usamos 'identifier' para capturar el email o el username
const identifier = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  let payload;

  // Detectamos si el usuario ingresó un email o un username
  if (identifier.value.includes('@')) {
    payload = {
      email: identifier.value,
      password: password.value,
    };
  } else {
    payload = {
      userName: identifier.value,
      password: password.value,
    };
  }

  try {
    const response = await api.post('/Auth/login', payload);
    console.log('Login exitoso:', response.data);

    // Guardar el token JWT usando el servicio de autenticación
    const token = response.data.token;
    authService.setToken(token);

    toast.success('¡Bienvenido de nuevo!');
    router.push('/panel-control');
  } catch (error: any) {
    console.error('Error de autenticación:', error);
    const requiresVerification = error?.response?.data?.requiresEmailVerification;
    if (requiresVerification) {
      toast.error('Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
      return;
    }
    const message = error?.response?.data?.message ?? 'Credenciales incorrectas. Por favor, intenta de nuevo.';
    toast.error(message);
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
