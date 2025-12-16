<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Sidebar from './components/Sidebar.vue'
import { authService } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const isSidebarOpen = ref(true)

// Rutas que requieren sidebar
const protectedRoutes = [
  '/panel-control',
  '/ingresos',
  '/egresos',
  '/reportes',
  '/reglas-financieras',
  '/configuracion',
]

const isProtectedRoute = computed(() => {
  return protectedRoutes.some((path) => route.path === path)
})

const isAuthenticated = ref(!!authService.getToken())

const showSidebar = computed(() => {
  return isAuthenticated.value && isProtectedRoute.value
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}

// Observar cambios en la ruta para actualizar el estado de autenticación
router.afterEach(() => {
  isAuthenticated.value = !!authService.getToken()
})
</script>

<template>
  <div class="app-container bg-[#F4F4F4] dark:bg-slate-900 transition-colors duration-300">
    <NavBar @toggle-sidebar="toggleSidebar" />

    <div class="app-content">
      <Sidebar v-if="showSidebar" :is-open="isSidebarOpen" @close="closeSidebar" />

      <main
        class="app-main"
        :class="{
          'lg:ml-64': showSidebar && isSidebarOpen,
          'ml-0': !showSidebar || !isSidebarOpen,
        }"
      >
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-content {
  padding-top: 4rem; /* altura del navbar */
}

.app-main {
  min-height: calc(100vh - 4rem);
  transition: margin-left 0.3s ease-in-out;
}

@media (max-width: 1023px) {
  .app-main {
    margin-left: 0 !important;
  }
}
</style>
