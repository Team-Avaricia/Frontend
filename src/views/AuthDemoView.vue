<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
        🔐 Sistema de Autenticación
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-gradient-to-br from-indigo-100 to-indigo-200 p-6 rounded-xl">
          <h2 class="text-2xl font-bold mb-4 text-indigo-800">Login</h2>
          <ul class="space-y-2 text-gray-700 mb-4">
            <li>✅ Email o Username</li>
            <li>✅ Ver/Ocultar contraseña</li>
            <li>✅ Recuperar contraseña</li>
            <li>✅ Validación completa</li>
          </ul>
          <RouterLink
            to="/iniciar-sesion"
            class="block w-full text-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Ir a Login
          </RouterLink>
        </div>

        <div class="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl">
          <h2 class="text-2xl font-bold mb-4 text-purple-800">Register</h2>
          <ul class="space-y-2 text-gray-700 mb-4">
            <li>✅ Formulario completo</li>
            <li>✅ Ver/Ocultar contraseñas</li>
            <li>✅ Medidor de seguridad</li>
            <li>✅ Confirmación de contraseña</li>
          </ul>
          <RouterLink
            to="/registrarse"
            class="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Ir a Register
          </RouterLink>
        </div>
      </div>

      <div class="bg-gray-50 rounded-xl p-6">
        <h3 class="text-xl font-bold mb-4 text-gray-800">📋 Características Implementadas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">🎨 UI/UX</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Diseño con Tailwind CSS 4.1</li>
              <li>• Modo oscuro soportado</li>
              <li>• Responsive design</li>
              <li>• Animaciones suaves</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">🔧 Funcionalidades</h4>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Integración con API</li>
              <li>• Notificaciones toast</li>
              <li>• Gestión de tokens JWT</li>
              <li>• Validación en tiempo real</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          💡 Revisa <code class="bg-gray-200 px-2 py-1 rounded">AUTH_DOCUMENTATION.md</code> para más información
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>

