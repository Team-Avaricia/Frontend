<template>
  <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-gray-300 shadow-lg" style="background-color: #F4F4F4;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left Section -->
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button
            v-if="isAuthenticated && isProtectedRoute"
            @click="toggleSidebar"
            class="p-2 rounded-xl text-gray-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 lg:hidden group"
          >
            <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2 group">
            <img
              src="@/assets/Riwi Wallet Logo.svg"
              alt="Riwi Wallet Logo"
              class="w-10 h-10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
            />
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-indigo-500 transition-all duration-300">
                Riwi Wallet
              </h1>
              <p class="text-[10px] text-gray-500 font-medium -mt-1">Tu asistente financiero</p>
            </div>
          </RouterLink>

          <!-- Breadcrumbs (Only when authenticated) -->
          <div v-if="isAuthenticated && isProtectedRoute" class="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span class="text-sm font-medium text-gray-600">{{ currentPageName }}</span>
          </div>
        </div>

        <!-- Right Section - Guest -->
        <div v-if="!isAuthenticated" class="flex items-center gap-3">
          <RouterLink
            to="/iniciar-sesion"
            class="px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
          >
            Iniciar sesión
          </RouterLink>
          <RouterLink
            to="/registrarse"
            class="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/60 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
          >
            <span class="relative z-10">Registrarse</span>
            <div class="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </RouterLink>
        </div>

        <!-- Right Section - Authenticated -->
        <div v-if="isAuthenticated" class="flex items-center gap-3">
          <!-- Notifications Button -->
          <button class="relative p-2.5 rounded-xl text-gray-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 group">
            <svg class="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <!-- Badge for notifications -->
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          <!-- User Menu Dropdown -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 border border-gray-200 hover:border-purple-300 group"
            >
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ring-2 ring-white">
                <span class="text-white font-bold text-sm">{{ userInitial }}</span>
              </div>
              <div class="hidden sm:flex flex-col items-start">
                <span class="text-sm font-semibold text-gray-900">{{ userName }}</span>
                <span class="text-xs text-gray-500">@{{ userHandle }}</span>
              </div>
              <svg
                class="w-4 h-4 text-gray-500 transition-transform duration-300"
                :class="{ 'rotate-180': isUserMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95 -translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-2"
            >
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-xl"
              >
                <!-- User Info Header -->
                <div class="bg-gradient-to-br from-purple-500 to-indigo-600 p-4 text-white">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/50">
                      <span class="text-xl font-bold">{{ userInitial }}</span>
                    </div>
                    <div>
                      <p class="font-bold text-base">{{ userName }}</p>
                      <p class="text-xs text-purple-100">{{ userEmail }}</p>
                    </div>
                  </div>
                </div>

                <!-- Menu Items -->
                <div class="py-2">
                  <button
                    disabled
                    class="flex items-center justify-between gap-3 px-4 py-3 opacity-60 cursor-not-allowed w-full relative"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-semibold text-gray-900">Mi Perfil</p>
                        <p class="text-xs text-gray-500">Ver información</p>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded-full border border-amber-300">
                      Próximamente
                    </span>
                  </button>

                  <RouterLink
                    to="/configuracion"
                    @click="closeUserMenu"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200 group"
                  >
                    <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="text-sm font-semibold text-gray-900">Configuración</p>
                      <p class="text-xs text-gray-500">Preferencias</p>
                    </div>
                  </RouterLink>

                  <div class="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2"></div>

                  <button
                    @click="handleLogout"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-all duration-200 group w-full"
                  >
                    <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div class="text-left">
                      <p class="text-sm font-semibold text-red-600">Cerrar Sesión</p>
                      <p class="text-xs text-gray-500">Salir de la cuenta</p>
                    </div>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/auth';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const emit = defineEmits<{ toggleSidebar: [] }>();

const isAuthenticated = ref(false);
const userName = ref('Usuario');
const userEmail = ref('');
const isUserMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const protectedRoutes = ['/panel-control', '/ingresos', '/egresos'];

const routeNames: Record<string, string> = {
  '/panel-control': 'Panel de Control',
  '/ingresos': 'Gestión de Ingresos',
  '/egresos': 'Gestión de Egresos'
};

const isProtectedRoute = computed(() => {
  return protectedRoutes.some(route => route === router.currentRoute.value.path);
});

const currentPageName = computed(() => {
  return routeNames[router.currentRoute.value.path] || 'Panel de Control';
});

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase();
});

const userHandle = computed(() => {
  return userEmail.value.split('@')[0] || 'usuario';
});

const toggleSidebar = () => {
  emit('toggleSidebar');
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};

const checkAuth = () => {
  const token = authService.getToken();
  isAuthenticated.value = !!token;

  if (isAuthenticated.value) {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        userName.value = userInfo.username || userInfo.email?.split('@')[0] || 'Usuario';
        userEmail.value = userInfo.email || 'demo@example.com';
      } catch (e) {
        console.error('Error al parsear userInfo:', e);
      }
    }
  }
};

const handleLogout = () => {
  authService.logout();
  isAuthenticated.value = false;
  userName.value = 'Usuario';
  userEmail.value = '';
  isUserMenuOpen.value = false;
  toast.success('¡Hasta pronto! Sesión cerrada correctamente', {
    icon: '👋',
  });
  router.push('/');
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu();
  }
};

onMounted(() => {
  checkAuth();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

router.afterEach(() => {
  checkAuth();
  closeUserMenu();
});
</script>

