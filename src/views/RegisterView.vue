<template>
  <div class="w-full flex items-center justify-center min-h-screen py-12 px-4 bg-[#F4F4F4] dark:bg-slate-900 transition-colors duration-300">
    <div class="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl transition-colors duration-300">
      <div class="text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <img
            src="@/assets/Riwi Wallet Logo.svg"
            alt="Riwi Wallet Logo"
            class="w-12 h-12"
          />
          <h2 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Riwi Wallet
          </h2>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Crea tu Cuenta</h1>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Ya tienes una?
          <RouterLink to="/iniciar-sesion" class="font-medium text-indigo-600 hover:text-purple-600 transition-colors">
            Inicia sesion
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
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Correo Electronico
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="tu@correo.com"
            class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contrasena
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="********"
              class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
          <div class="h-2 w-full bg-gray-200 rounded">
            <div class="h-full rounded transition-all duration-300" :class="strengthBarClasses"></div>
          </div>
          <p class="text-xs mt-1" :class="strengthTextClasses">
            {{ strengthText }}
          </p>
        </div>

        <div>
          <label for="password-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirmar Contrasena
          </label>
          <div class="relative">
            <input
              id="password-confirm"
              v-model="passwordConfirm"
              :type="showPasswordConfirm ? 'text' : 'password'"
              required
              placeholder="********"
              class="w-full px-3 py-2 mt-1 text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="button"
              @click="showPasswordConfirm = !showPasswordConfirm"
              class="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
          <p v-if="passwordsDoNotMatch" class="text-xs text-red-500 mt-1">
            Las contrasenas no coinciden.
          </p>
        </div>

        <div>
          <button
            type="submit"
            class="w-full px-4 py-3 mt-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
            :disabled="passwordsDoNotMatch"
          >
            Registrarse
          </button>
        </div>
      </form>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">O registrate con</span>
        </div>
      </div>

      <!-- Social Registration Buttons -->
      <div class="space-y-3">
        <button
          type="button"
          @click="handleGoogleRegister"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="font-medium text-gray-700 dark:text-gray-200">Registrarse con Google</span>
        </button>

        <button
          type="button"
          @click="handleMicrosoftRegister"
          class="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
          <span class="font-medium text-gray-700 dark:text-gray-100">Registrarse con Microsoft</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authApi } from '@/services/api';

const router = useRouter();
const toast = useToast();

// Variables reactivas para los campos del formulario
const name = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

// Variables para mostrar/ocultar contrasenas
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// Logica para validar que las contrasenas coincidan
const passwordsDoNotMatch = computed(() => {
  return password.value !== '' && passwordConfirm.value !== '' && password.value !== passwordConfirm.value;
});

// --- Logica para el Medidor de Seguridad ---
const passwordStrength = computed(() => {
  let score = 0;
  if (!password.value) return 0;

  // Criterios para evaluar la contrasena
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
    case 1: return 'Muy debil';
    case 2: return 'Debil';
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
    toast.error('Las contrasenas no coinciden. Por favor, verifica.');
    return;
  }

  try {
    // Concatenar nombre completo
    let fullName = `${name.value} ${lastName.value}`.trim();

    // Si el nombre completo excede 20 caracteres, usar solo primer nombre y primer apellido
    if (fullName.length > 20) {
      const firstName = name.value.trim().split(' ')[0];
      const firstLastName = lastName.value.trim().split(' ')[0];
      fullName = `${firstName} ${firstLastName}`.trim();

      // Si aún excede, truncar
      if (fullName.length > 20) {
        fullName = fullName.substring(0, 20).trim();
      }

      console.log('Nombre truncado a 20 caracteres:', fullName);
    }

    // Validar que el nombre tenga al menos 3 caracteres
    if (fullName.length < 3) {
      toast.error('El nombre es demasiado corto. Debe tener al menos 3 caracteres.');
      return;
    }

    const requestData = {
      username: fullName,
      email: email.value,
      password: password.value,
    };

    console.log('Enviando datos de registro:', requestData);

    // La API de Spring Boot espera: username, email, password
    const response = await authApi.register(requestData);
    console.log('Registro exitoso:', response.data);
    toast.success('Cuenta creada exitosamente! Ahora seras redirigido para iniciar sesion.');
    router.push('/iniciar-sesion');
  } catch (error: unknown) {
    console.error('Error en el registro:', error);
    const axiosError = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          errors?: Record<string, string>[];
          error?: string;
        }
      }
    };

    // Log del error completo para debugging
    if (axiosError?.response) {
      console.error('Response status:', axiosError.response.status);
      console.error('Response data:', JSON.stringify(axiosError.response.data, null, 2));
    }

    // Manejar diferentes tipos de errores
    let message = 'Ocurrio un error al crear la cuenta.';

    if (axiosError?.response?.data) {
      const data = axiosError.response.data;

      // Error de validación de Spring Boot
      if (data.errors && Array.isArray(data.errors)) {
        const validationErrors = data.errors.map((err: Record<string, string>) => err.defaultMessage || err.message).join(', ');
        message = `Error de validación: ${validationErrors}`;
      }
      // Mensaje de error simple
      else if (data.message) {
        message = data.message;
      }
      // Error genérico
      else if (data.error) {
        message = data.error;
      }
    }

    toast.error(message);
  }
};

const handleGoogleRegister = () => {
  toast.info('Redirigiendo a Google...');
  authApi.oauth2.googleLogin();
};

const handleMicrosoftRegister = () => {
  toast.info('Redirigiendo a Microsoft...');
  authApi.oauth2.microsoftLogin();
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

