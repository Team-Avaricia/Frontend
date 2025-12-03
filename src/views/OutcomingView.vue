<script setup lang="ts">
import { ref, computed } from 'vue';

// Interfaz para los egresos
interface Egreso {
  id: number;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

// Categorías disponibles
const categorias = [
  'Vivienda',
  'Alimentación',
  'Transporte',
  'Servicios',
  'Salud',
  'Educación',
  'Entretenimiento',
  'Ropa',
  'Deudas',
  'Otros'
];

// Datos de ejemplo
const egresos = ref<Egreso[]>([
  { id: 1, descripcion: 'Alquiler', monto: 1200000.00, fecha: '2025-11-01', categoria: 'Vivienda' },
  { id: 2, descripcion: 'Supermercado', monto: 500000.00, fecha: '2025-11-05', categoria: 'Alimentación' },
  { id: 3, descripcion: 'Servicios (luz, agua, gas)', monto: 210000.00, fecha: '2025-11-10', categoria: 'Servicios' },
  { id: 4, descripcion: 'Transporte', monto: 500000.00, fecha: '2025-11-12', categoria: 'Transporte' },
  { id: 5, descripcion: 'Entretenimiento', monto: 200000.00, fecha: '2025-11-18', categoria: 'Ocio' },
]);

// Estado del formulario
const showModal = ref(false);
const editingId = ref<number | null>(null);
const formData = ref({
  descripcion: '',
  monto: 0,
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'Otros'
});

// Filtros
const filtroCategoria = ref('');
const filtroBusqueda = ref('');
const ordenarPor = ref<'fecha' | 'monto'>('fecha');
const ordenAscendente = ref(false);

// Cálculos
const totalEgresos = computed(() => egresos.value.reduce((sum, item) => sum + item.monto, 0));

const egresosFiltrados = computed(() => {
  let resultado = [...egresos.value];

  // Filtrar por categoría
  if (filtroCategoria.value) {
    resultado = resultado.filter(e => e.categoria === filtroCategoria.value);
  }

  // Filtrar por búsqueda
  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase();
    resultado = resultado.filter(e =>
      e.descripcion.toLowerCase().includes(busqueda) ||
      e.categoria.toLowerCase().includes(busqueda)
    );
  }

  // Ordenar
  resultado.sort((a, b) => {
    if (ordenarPor.value === 'fecha') {
      const diff = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      return ordenAscendente.value ? diff : -diff;
    } else {
      return ordenAscendente.value ? a.monto - b.monto : b.monto - a.monto;
    }
  });

  return resultado;
});

// Estadísticas por categoría
const estadisticasPorCategoria = computed(() => {
  const stats: Record<string, { total: number; count: number }> = {};

  egresos.value.forEach(egreso => {
    if (!stats[egreso.categoria]) {
      stats[egreso.categoria] = { total: 0, count: 0 };
    }
    stats[egreso.categoria].total += egreso.monto;
    stats[egreso.categoria].count++;
  });

  return Object.entries(stats)
    .map(([categoria, data]) => ({ categoria, ...data }))
    .sort((a, b) => b.total - a.total);
});

// Mayor gasto
const mayorGasto = computed(() => {
  if (egresos.value.length === 0) return null;
  return egresos.value.reduce((max, current) => current.monto > max.monto ? current : max);
});

// Funciones
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

const abrirModalNuevo = () => {
  editingId.value = null;
  formData.value = {
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Otros'
  };
  showModal.value = true;
};

const abrirModalEditar = (egreso: Egreso) => {
  editingId.value = egreso.id;
  formData.value = { ...egreso };
  showModal.value = true;
};

const guardarEgreso = () => {
  if (editingId.value !== null) {
    // Editar existente
    const index = egresos.value.findIndex(e => e.id === editingId.value);
    if (index !== -1) {
      egresos.value[index] = { ...formData.value, id: editingId.value };
    }
  } else {
    // Crear nuevo
    const nuevoId = Math.max(...egresos.value.map(e => e.id), 0) + 1;
    egresos.value.push({ ...formData.value, id: nuevoId });
  }
  showModal.value = false;
};

const eliminarEgreso = (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este egreso?')) {
    egresos.value = egresos.value.filter(e => e.id !== id);
  }
};

const getCategoriaColor = (categoria: string) => {
  const colores: Record<string, string> = {
    'Vivienda': 'bg-red-100 text-red-800',
    'Alimentación': 'bg-orange-100 text-orange-800',
    'Transporte': 'bg-blue-100 text-blue-800',
    'Servicios': 'bg-yellow-100 text-yellow-800',
    'Salud': 'bg-pink-100 text-pink-800',
    'Educación': 'bg-purple-100 text-purple-800',
    'Entretenimiento': 'bg-indigo-100 text-indigo-800',
    'Ropa': 'bg-teal-100 text-teal-800',
    'Deudas': 'bg-rose-100 text-rose-800',
    'Otros': 'bg-gray-100 text-gray-800'
  };
  return colores[categoria] || 'bg-gray-100 text-gray-800';
};

const getCategoriaIcon = (categoria: string) => {
  const iconos: Record<string, string> = {
    'Vivienda': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    'Alimentación': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    'Transporte': 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    'Servicios': 'M13 10V3L4 14h7v7l9-11h-7z',
    'Salud': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    'Educación': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    'Entretenimiento': 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'Ropa': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    'Deudas': 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    'Otros': 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z'
  };
  return iconos[categoria] || iconos['Otros'];
};
</script>

<template>
  <div class="w-full min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-3">
              <RouterLink to="/panel-control" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </RouterLink>
              <h1 class="text-3xl font-bold text-gray-900">Egresos</h1>
            </div>
            <p class="text-gray-600 mt-2 ml-10">Controla tus gastos y administra tu presupuesto</p>
          </div>
          <button
            @click="abrirModalNuevo"
            class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Egreso
          </button>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white md:col-span-2">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm font-medium">Total de Egresos</p>
              <p class="text-3xl font-bold mt-1">{{ formatCurrency(totalEgresos) }}</p>
            </div>
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-gray-500 text-sm">Transacciones</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ egresos.length }}</p>
          <p class="text-red-600 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            Este mes
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-gray-500 text-sm">Mayor Gasto</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ mayorGasto ? formatCurrency(mayorGasto.monto) : formatCurrency(0) }}
          </p>
          <p class="text-gray-500 text-sm mt-2 truncate" :title="mayorGasto?.descripcion">
            {{ mayorGasto?.descripcion || 'Sin egresos' }}
          </p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Lista de egresos -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- Filtros -->
            <div class="p-4 border-b bg-gray-50">
              <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      v-model="filtroBusqueda"
                      type="text"
                      placeholder="Buscar egresos..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                <select
                  v-model="filtroCategoria"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Todas las categorías</option>
                  <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <div class="flex gap-2">
                  <button
                    @click="ordenarPor = 'fecha'; ordenAscendente = !ordenAscendente"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors',
                      ordenarPor === 'fecha' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    Fecha {{ ordenarPor === 'fecha' ? (ordenAscendente ? '↑' : '↓') : '' }}
                  </button>
                  <button
                    @click="ordenarPor = 'monto'; ordenAscendente = !ordenAscendente"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors',
                      ordenarPor === 'monto' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    Monto {{ ordenarPor === 'monto' ? (ordenAscendente ? '↑' : '↓') : '' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Tabla de egresos -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b">
                  <tr>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Descripción</th>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Categoría</th>
                    <th class="text-left py-4 px-6 font-semibold text-gray-700">Fecha</th>
                    <th class="text-right py-4 px-6 font-semibold text-gray-700">Monto</th>
                    <th class="text-center py-4 px-6 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="egreso in egresosFiltrados"
                    :key="egreso.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="p-2 bg-red-100 rounded-lg">
                          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getCategoriaIcon(egreso.categoria)" />
                          </svg>
                        </div>
                        <span class="font-medium text-gray-900">{{ egreso.descripcion }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <span :class="['px-3 py-1 rounded-full text-sm font-medium', getCategoriaColor(egreso.categoria)]">
                        {{ egreso.categoria }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-gray-600">{{ formatDate(egreso.fecha) }}</td>
                    <td class="py-4 px-6 text-right font-semibold text-red-600">
                      -{{ formatCurrency(egreso.monto) }}
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex justify-center gap-2">
                        <button
                          @click="abrirModalEditar(egreso)"
                          class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="eliminarEgreso(egreso.id)"
                          class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Estado vacío -->
              <div v-if="egresosFiltrados.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500">No se encontraron egresos</p>
                <button
                  @click="abrirModalNuevo"
                  class="mt-4 text-red-600 hover:text-red-700 font-medium"
                >
                  Agregar primer egreso
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel lateral con estadísticas -->
        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Por Categoría</h3>
            <div class="space-y-4">
              <div v-for="stat in estadisticasPorCategoria" :key="stat.categoria">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-gray-700 text-sm">{{ stat.categoria }}</span>
                  <span class="text-gray-900 font-medium text-sm">{{ formatCurrency(stat.total) }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-red-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(stat.total / totalEgresos) * 100}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ stat.count }} transacción(es) · {{ ((stat.total / totalEgresos) * 100).toFixed(1) }}%</p>
              </div>
            </div>
          </div>

          <!-- Alerta de presupuesto -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <h3 class="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Análisis de Gastos
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-amber-700">Gasto promedio:</span>
                <span class="font-medium text-amber-900">
                  {{ egresos.length ? formatCurrency(totalEgresos / egresos.length) : formatCurrency(0) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-amber-700">Mayor categoría:</span>
                <span class="font-medium text-amber-900">
                  {{ estadisticasPorCategoria[0]?.categoria || 'N/A' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
            <h3 class="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Consejos
            </h3>
            <ul class="text-sm text-red-700 space-y-2">
              <li class="flex items-start gap-2">
                <span class="text-red-500">•</span>
                Registra cada gasto inmediatamente para no olvidarlo
              </li>
              <li class="flex items-start gap-2">
                <span class="text-red-500">•</span>
                Establece límites por categoría para controlar gastos
              </li>
              <li class="flex items-start gap-2">
                <span class="text-red-500">•</span>
                Revisa semanalmente para identificar gastos innecesarios
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para agregar/editar egreso -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ editingId ? 'Editar Egreso' : 'Nuevo Egreso' }}
          </h2>
          <button
            @click="showModal = false"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="guardarEgreso" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              v-model="formData.descripcion"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Ej: Compra en supermercado"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                v-model.number="formData.monto"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="formData.categoria"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              v-model="formData.fecha"
              type="date"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {{ editingId ? 'Guardar Cambios' : 'Agregar Egreso' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
