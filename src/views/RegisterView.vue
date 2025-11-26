<template>
  <div class="w-full flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Crea tu Cuenta</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          ¿Ya tienes una?
          <RouterLink to="/iniciar-sesion" class="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión
          </RouterLink>
        </p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder=""
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Apellido
          </label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            required
            placeholder=""
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="userName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre de usuario
          </label>
          <input
            id="userName"
            v-model="userName"
            type="text"
            required
            placeholder=""
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo Electrónico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="tu@correo.com"
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña
          </label>
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

        <div v-if="password.length > 0" class="w-full">
          <div class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded">
            <div class="h-full rounded transition-all duration-300" :class="strengthBarClasses"></div>
          </div>
          <p class="text-xs mt-1" :class="strengthTextClasses">
            {{ strengthText }}
          </p>
        </div>

        <div>
          <label for="password-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar Contraseña
          </label>
          <div class="relative">
            <input
              id="password-confirm"
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              required
              placeholder="••••••••"
              class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg v-if="!showPasswordConfirm" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="passwordsDoNotMatch" class="text-xs text-red-500 dark:text-red-400 mt-1">
            Las contraseñas no coinciden.
          </p>
        </div>

        <div>
          <button
            type="submit"
            class="w-full px-4 py-3 mt-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors duration-200"
            :disabled="passwordsDoNotMatch"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '@/services/api';

const router = useRouter();
const toast = useToast();

// Variables reactivas para los campos del formulario
const name = ref('');
const lastName = ref('');
const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

// Variables para mostrar/ocultar contraseñas
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// Lógica para validar que las contraseñas coincidan
const passwordsDoNotMatch = computed(() => {
  return password.value !== '' && passwordConfirm.value !== '' && password.value !== passwordConfirm.value;
});

// --- Lógica para el Medidor de Seguridad ---
const passwordStrength = computed(() => {
  let score = 0;
  if (!password.value) return 0;

  // Criterios para evaluar la contraseña
  if (password.value.length >= 8) score++;
  if (/[a-z]/.test(password.value)) score++;
  if (/[A-Z]/.test(password.value)) score++;
  if (/[0-9]/.test(password.value)) score++;
  if (/[^A-Za-z0-9]/.test(password.value)) score++; // Caracteres especiales

  return score;
});

const strengthBarClasses = computed(() => {
  switch (passwordStrength.value) {
    case 1: return 'w-1/5 bg-red-500';
    case 2: return 'w-2/5 bg-orange-500';
    case 3: return 'w-3/5 bg-yellow-500';
    case 4: return 'w-4/5 bg-blue-500';
    case 5: return 'w-full bg-green-500';
    default: return 'w-0';
  }
});

const strengthText = computed(() => {
  switch (passwordStrength.value) {
    case 1: return 'Muy débil';
    case 2: return 'Débil';
    case 3: return 'Aceptable';
    case 4: return 'Buena';
    case 5: return 'Excelente';
    default: return '';
  }
});

const strengthTextClasses = computed(() => {
  switch (passwordStrength.value) {
    case 1: return 'text-red-500';
    case 2: return 'text-orange-500';
    case 3: return 'text-yellow-600';
    case 4: return 'text-blue-500';
    case 5: return 'text-green-500';
    default: return 'text-gray-500';
  }
});

const handleRegister = async () => {
  if (password.value !== passwordConfirm.value) {
    toast.error('Las contraseñas no coinciden. Por favor, verifica.');
    return;
  }

  const payload = {
    name: name.value,
    lastName: lastName.value,
    userName: userName.value,
    email: email.value,
    password: password.value,
  };

  try {
    const response = await api.post('/Auth/register', payload);
    console.log('Registro exitoso:', response.data);
    toast.success('¡Cuenta creada exitosamente! Ahora serás redirigido para iniciar sesión.');
    router.push('/iniciar-sesion');
  } catch (error: any) {
    console.error('Error en el registro:', error);
    const message = error?.response?.data?.message || 'Ocurrió un error al crear la cuenta. Es posible que el correo o el nombre de usuario ya existan.';
    toast.error(message);
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
