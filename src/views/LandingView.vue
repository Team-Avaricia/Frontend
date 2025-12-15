﻿<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToRegister = () => {
  router.push('/registrarse')
}

const navigateToLogin = () => {
  router.push('/iniciar-sesion')
}

const features = [
  {
    icon: '💬',
    title: 'Control por Chat',
    description: 'Gestiona tus finanzas desde WhatsApp o Telegram. Sin apps complicadas, solo conversaciones naturales.'
  },
  {
    icon: '🤖',
    title: 'IA Proactiva',
    description: 'Inteligencia Artificial que analiza y valida tus gastos en tiempo real, previniendo decisiones impulsivas.'
  },
  {
    icon: '⚡',
    title: 'Decisiones Instantáneas',
    description: 'Obtén aprobación o rechazo inmediato de gastos basado en tu presupuesto configurado.'
  },
  {
    icon: '📊',
    title: 'Reglas Personalizables',
    description: 'Define tus propias reglas presupuestarias y límites de gasto según tus necesidades.'
  },
  {
    icon: '🎯',
    title: 'Prevención de Impulsos',
    description: 'Elimina la latencia entre el impulso de gasto y la revisión presupuestaria.'
  },
  {
    icon: '🔒',
    title: 'Seguro y Confiable',
    description: 'Tu información financiera protegida con los más altos estándares de seguridad.'
  }
]

const benefits = [
  'Reduce gastos innecesarios hasta en un 40%',
  'Ahorra tiempo con gestión automática',
  'Alcanza tus metas financieras más rápido',
  'Control total desde tu mensajería favorita'
]
</script>

<template>
  <div class="w-full overflow-x-hidden">
    <!-- Hero Section with Tailwind -->
    <section class="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white py-20 px-5 min-h-[600px] flex items-center">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="z-10">
          <div class="flex items-center gap-3 mb-6">
            <img
              src="@/assets/Riwi Wallet Logo.svg"
              alt="Riwi Wallet Logo"
              class="w-16 h-16"
            />
            <img
              src="@/assets/Riwi Wallet Logotipo.svg"
              alt="Riwi Wallet"
              class="h-12"
            />
          </div>
          <h1 class="mb-5 flex flex-col gap-2.5">
            <span class="text-2xl lg:text-3xl font-semibold opacity-95">
              Tu Asistente Financiero Inteligente
            </span>
          </h1>
          <p class="text-lg lg:text-xl leading-relaxed mb-8 opacity-90">
            Transforma tu gestión financiera con IA proactiva. Controla tus gastos en tiempo real
            a través de WhatsApp o Telegram y toma decisiones inteligentes antes de gastar.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              @click="navigateToRegister"
              class="px-8 py-3.5 bg-white text-indigo-600 rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl shadow-lg"
            >
              Comenzar Gratis
            </button>
            <button
              @click="navigateToLogin"
              class="px-8 py-3.5 bg-transparent text-white border-2 border-white rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
            >
              Iniciar Sesión
            </button>
          </div>
          <p class="text-sm opacity-80">✨ Sin tarjeta de crédito requerida</p>
        </div>

        <!-- Phone Mockup with Tailwind -->
        <div class="flex justify-center items-center">
          <div class="relative w-[300px] h-[600px] bg-gray-900 rounded-[40px] p-4 shadow-2xl">
            <!-- Phone Notch -->
            <div class="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-gray-700 rounded-full"></div>

            <!-- Phone Screen -->
            <div class="w-full h-full bg-[#e5ddd5] rounded-[28px] pt-10 px-4 pb-4 overflow-y-auto flex flex-col gap-2.5">
              <div class="max-w-[80%] p-3 rounded-xl text-sm leading-relaxed bg-white self-start rounded-bl-sm text-gray-900 animate-fadeIn">
                <p class="m-0">💰 ¿Puedo gastar $50 en almuerzo?</p>
              </div>
              <div class="max-w-[80%] p-3 rounded-xl text-sm leading-relaxed bg-[#dcf8c6] self-end rounded-br-sm text-gray-900 animate-fadeIn animation-delay-200">
                <p class="m-0">❌ Rechazado: Has alcanzado tu límite de comidas esta semana ($200/200)</p>
              </div>
              <div class="max-w-[80%] p-3 rounded-xl text-sm leading-relaxed bg-white self-start rounded-bl-sm text-gray-900 animate-fadeIn animation-delay-400">
                <p class="m-0">💳 Compra de $30 en supermercado</p>
              </div>
              <div class="max-w-[80%] p-3 rounded-xl text-sm leading-relaxed bg-[#dcf8c6] self-end rounded-br-sm text-gray-900 animate-fadeIn animation-delay-600">
                <p class="m-0">✅ Aprobado: Quedan $170 en tu presupuesto de alimentos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section with Tailwind -->
    <section class="py-20 px-5 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl lg:text-5xl text-center mb-4 text-gray-800 font-bold">
          ¿Por qué Riwi Wallet?
        </h2>
        <p class="text-center text-lg text-gray-600 mb-12">
          Una solución de vanguardia que transforma la gestión financiera tradicional
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="bg-white p-10 rounded-xl text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div class="text-5xl lg:text-6xl mb-5">{{ feature.icon }}</div>
            <h3 class="text-xl lg:text-2xl mb-4 text-gray-800 font-semibold">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section with Tailwind -->
    <section class="py-20 px-5 bg-white">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl lg:text-5xl text-center mb-12 text-gray-800 font-bold">
          Cómo Funciona
        </h2>
        <div class="flex flex-wrap justify-between items-center gap-5 max-w-5xl mx-auto">
          <div class="flex-1 min-w-[180px] text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
              1
            </div>
            <h3 class="text-xl lg:text-2xl mb-2.5 text-gray-800 font-semibold">Regístrate</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Crea tu cuenta en segundos y conecta tu mensajería favorita
            </p>
          </div>

          <div class="hidden lg:block text-3xl text-gray-300 font-bold">→</div>

          <div class="flex-1 min-w-[180px] text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
              2
            </div>
            <h3 class="text-xl lg:text-2xl mb-2.5 text-gray-800 font-semibold">Configura</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Define tu presupuesto mensual y reglas personalizadas
            </p>
          </div>

          <div class="hidden lg:block text-3xl text-gray-300 font-bold">→</div>

          <div class="flex-1 min-w-[180px] text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
              3
            </div>
            <h3 class="text-xl lg:text-2xl mb-2.5 text-gray-800 font-semibold">Consulta</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Pregunta antes de gastar y recibe respuestas instantáneas
            </p>
          </div>

          <div class="hidden lg:block text-3xl text-gray-300 font-bold">→</div>

          <div class="flex-1 min-w-[180px] text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
              4
            </div>
            <h3 class="text-xl lg:text-2xl mb-2.5 text-gray-800 font-semibold">Ahorra</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              Alcanza tus metas financieras con control proactivo
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section with Tailwind -->
    <section class="py-20 px-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="text-center lg:text-left">
            <h2 class="text-4xl lg:text-5xl mb-8 font-bold">Beneficios Comprobados</h2>
            <ul class="list-none p-0 my-8">
              <li
                v-for="(benefit, index) in benefits"
                :key="index"
                class="flex items-center gap-4 text-lg lg:text-xl mb-5 justify-center lg:justify-start"
              >
                <span class="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </span>
                <span>{{ benefit }}</span>
              </li>
            </ul>
            <button
              @click="navigateToRegister"
              class="px-8 py-3.5 bg-white text-indigo-600 rounded-lg text-base font-semibold uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl shadow-lg"
            >
              Comienza Ahora
            </button>
          </div>

          <div class="grid gap-5">
            <div class="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center">
              <div class="text-5xl font-extrabold mb-2.5">40%</div>
              <div class="opacity-90">Reducción en gastos impulsivos</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center">
              <div class="text-5xl font-extrabold mb-2.5">85%</div>
              <div class="opacity-90">Usuarios alcanzan sus metas</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center">
              <div class="text-5xl font-extrabold mb-2.5">24/7</div>
              <div class="opacity-90">Asistencia disponible</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section with Tailwind -->
    <section class="py-20 px-5 bg-gray-800 text-white text-center">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl lg:text-5xl mb-5 font-bold">
          ¿Listo para Transformar tus Finanzas?
        </h2>
        <p class="text-lg lg:text-xl mb-10 opacity-90">
          Únete a miles de usuarios que ya controlan sus gastos de forma inteligente
        </p>
        <button
          @click="navigateToRegister"
          class="px-12 py-4 text-lg bg-white text-indigo-600 rounded-lg font-semibold uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl shadow-lg"
        >
          Crear Cuenta Gratuita
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}
</style>

