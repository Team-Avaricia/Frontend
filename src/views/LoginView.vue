﻿﻿<template>
  <div class="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-purple-100 py-12 px-4">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
      <div class="text-center">
        <div class="flex items-center justify-center gap-2 mb-4">
          <img
            src="@/assets/Riwi Wallet Logo.svg"
            alt="Riwi Wallet Logo"
            class="w-12 h-12"
          />
          <img
            src="@/assets/Riwi Wallet Logotipo.svg"
            alt="Riwi Wallet"
            class="h-8"
          />
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Inicia Sesion</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Aun no tienes una cuenta?
          <RouterLink to="/registrarse" class="font-medium text-indigo-600 hover:text-purple-600 transition-colors">
            Registrate gratis
          </RouterLink>
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="identifier" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo Electronico o Nombre de Usuario
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
              Contrasena
            </label>
            <RouterLink to="/recuperar-contrasena" class="text-sm text-indigo-600 hover:text-indigo-500">
              Olvidaste tu contrasena?
            </RouterLink>
          </div>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="********"
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
            class="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Entrar
          </button>
        </div>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">O continua con</span>
        </div>
      </div>

      <!-- Social Login Buttons -->
      <div class="space-y-3">
        <button
          type="button"
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="font-medium text-gray-700 dark:text-gray-200">Continuar con Google</span>
        </button>

        <button
          type="button"
          @click="handleMicrosoftLogin"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
          <span class="font-medium text-gray-700 dark:text-gray-200">Continuar con Microsoft</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authApi } from '@/services/api';
import { authService } from '@/services/auth';

const router = useRouter();
const toast = useToast();

// Usamos 'identifier' para capturar el email o el username
const identifier = ref('');
const password = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  try {
    // La API de Spring Boot usa email para login
    const response = await authApi.login(identifier.value, password.value);
    console.log('Login exitoso:', response.data);

    // Guardar el token JWT usando el servicio de autenticacion
    const token = response.data.token;
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

    // Guardar información del usuario en localStorage
    const userInfo = {
      userId: userId,
      username: response.data.username,
      email: response.data.email,
      provider: response.data.provider || 'LOCAL'
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    console.log('UserInfo guardado:', userInfo);

    toast.success('Bienvenido de nuevo!');
    router.push('/panel-control');
  } catch (error: unknown) {
    console.error('Error de autenticacion:', error);
    const axiosError = error as { response?: { data?: { requiresEmailVerification?: boolean; message?: string } } };
    const requiresVerification = axiosError?.response?.data?.requiresEmailVerification;
    if (requiresVerification) {
      toast.error('Debes verificar tu email antes de iniciar sesion. Revisa tu bandeja de entrada.');
      return;
    }
    const message = axiosError?.response?.data?.message ?? 'Credenciales incorrectas. Por favor, intenta de nuevo.';
    toast.error(message);
  }
};

const handleGoogleLogin = () => {
  toast.info('Redirigiendo a Google...');
  authApi.oauth2.googleLogin();
};

const handleMicrosoftLogin = () => {
  toast.info('Redirigiendo a Microsoft...');
  authApi.oauth2.microsoftLogin();
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

