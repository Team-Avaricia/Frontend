﻿<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { mainApi } from '@/services/api';
import { authService } from '@/services/auth';
import { useToast } from 'vue-toastification';
import { TransactionType, TransactionSource } from '@/types/api';
import type { Transaction } from '@/types/api';
import { useTransactionEvents, TransactionEvent } from '@/composables/useTransactionEvents';

const router = useRouter();
const toast = useToast();
const { emit: emitTransactionEvent } = useTransactionEvents();

// Estado de carga
const loading = ref(true);
const userId = ref('');

// Interfaz para los ingresos (compatible con Transaction)
interface Income {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
  categoria: string;
}

// Categorías disponibles
const categorias = [
  'Salario',
  'Freelance',
  'Inversiones',
  'Ventas',
  'Regalos',
  'Reembolsos',
  'Otros'
];

// Datos de ingresos (cargados desde API)
const income = ref<Income[]>([]);

// Estado del formulario
const showModal = ref(false);
const editingId = ref<string | null>(null);
const formData = ref({
  descripcion: '',
  monto: 0,
  fecha: new Date().toISOString().split('T')[0],
  categoria: 'Salario'
});

// Filtros
const filtroCategoria = ref('');
const filtroBusqueda = ref('');
const ordenarPor = ref<'fecha' | 'monto'>('fecha');
const ordenAscendente = ref(false);

// Cálculos
const totalIncome = computed(() => income.value.reduce((sum, item) => sum + item.monto, 0));

const incomeFiltered = computed(() => {
  let resultado = [...income.value];

  // Filtrar por categoría
  if (filtroCategoria.value) {
    resultado = resultado.filter(i => i.categoria === filtroCategoria.value);
  }

  // Filtrar por búsqueda
  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase();
    resultado = resultado.filter(i =>
      i.descripcion.toLowerCase().includes(busqueda) ||
      i.categoria.toLowerCase().includes(busqueda)
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

  income.value.forEach(item => {
    if (!stats[item.categoria]) {
      stats[item.categoria] = { total: 0, count: 0 };
    }
    const stat = stats[item.categoria];
    if (stat) {
      stat.total += item.monto;
      stat.count++;
    }
  });

  return Object.entries(stats)
    .map(([categoria, data]) => ({ categoria, ...data }))
    .sort((a, b) => b.total - a.total);
});

// Cargar ingresos desde la API
const loadIncome = async () => {
  try {
    loading.value = true;

    if (!userId.value) {
      console.error('No hay userId disponible');
      return;
    }

    const response = await mainApi.transactions.getByUserId(userId.value, 'Income');

    // Convertir Transaction a Income
    income.value = response.data.map((t: Transaction) => ({
      id: t.id,
      descripcion: t.description || 'Sin descripción',
      monto: t.amount,
      fecha: t.createdAt,
      categoria: t.category
    }));

    console.log('Ingresos cargados:', income.value.length);
  } catch (error) {
    console.error('Error al cargar ingresos:', error);
    toast.error('Error al cargar los ingresos');
  } finally {
    loading.value = false;
  }
};

// Funciones
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

const openNewModal = () => {
  editingId.value = null;
  formData.value = {
    descripcion: '',
    monto: 0,
    fecha: new Date().toISOString().split('T')[0],
    categoria: 'Salario'
  };
  showModal.value = true;
};

const openEditModal = (item: Income) => {
  editingId.value = item.id;
  formData.value = {
    descripcion: item.descripcion,
    monto: item.monto,
    fecha: item.fecha.split('T')[0],
    categoria: item.categoria
  };
  showModal.value = true;
};

const saveIncome = async () => {
  try {
    if (editingId.value !== null) {
      // TODO: Implementar edición en el backend
      toast.info('La edición de transacciones estará disponible próximamente');
      showModal.value = false;
      return;
    }

    // Crear nuevo ingreso
    await mainApi.transactions.create({
      userId: userId.value,
      amount: formData.value.monto,
      type: TransactionType.Income,
      category: formData.value.categoria,
      description: formData.value.descripcion,
      source: TransactionSource.Manual
    });

    toast.success('Ingreso agregado exitosamente');
    showModal.value = false;
    await loadIncome(); // Recargar lista
    emitTransactionEvent(TransactionEvent.CREATED); // Notificar a otros componentes
  } catch (error) {
    console.error('Error al guardar ingreso:', error);
    toast.error('Error al guardar el ingreso');
  }
};

const deleteIncome = async (id: string) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
    return;
  }

  try {
    await mainApi.transactions.delete(id);
    toast.success('Ingreso eliminado exitosamente');
    await loadIncome(); // Recargar lista
    emitTransactionEvent(TransactionEvent.DELETED); // Notificar a otros componentes
  } catch (error) {
    console.error('Error al eliminar ingreso:', error);
    toast.error('Error al eliminar el ingreso');
  }
};

const getCategoriaColor = (categoria: string) => {
  const colores: Record<string, string> = {
    'Salario': 'bg-blue-100 text-blue-800',
    'Freelance': 'bg-purple-100 text-purple-800',
    'Inversiones': 'bg-green-100 text-green-800',
    'Ventas': 'bg-yellow-100 text-yellow-800',
    'Regalos': 'bg-pink-100 text-pink-800',
    'Reembolsos': 'bg-indigo-100 text-indigo-800',
    'Otros': 'bg-gray-100 text-gray-800'
  };
  return colores[categoria] || 'bg-gray-100 text-gray-800';
};

// Inicializar
onMounted(async () => {
  // Obtener userId
  const token = authService.getToken();
  if (!token) {
    router.push('/iniciar-sesion');
    return;
  }

  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr);
    userId.value = userInfo.userId || '';
  }

  if (!userId.value) {
    // Intentar extraer del token
    try {
      const parts = token.split('.');
      if (parts.length === 3 && parts[1]) {
        const tokenPayload = JSON.parse(atob(parts[1]));
        userId.value = tokenPayload.sub || tokenPayload.userId || tokenPayload.id || '';
      }
    } catch (e) {
      console.error('Error al extraer userId:', e);
    }
  }

  if (userId.value) {
    await loadIncome();
  } else {
    toast.error('No se pudo obtener la información del usuario');
    loading.value = false;
  }
});
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
              <h1 class="text-3xl font-bold text-gray-900">Ingresos</h1>
            </div>
            <p class="text-gray-600 mt-2 ml-10">Gestiona todos tus ingresos y fuentes de dinero</p>
          </div>
          <button
            @click="openNewModal"
            class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Ingreso
          </button>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white md:col-span-2">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Total de Ingresos</p>
              <p class="text-3xl font-bold mt-1">{{ formatCurrency(totalIncome) }}</p>
            </div>
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-gray-500 text-sm">Transacciones</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">{{ income.length }}</p>
          <p class="text-green-600 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Este mes
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <p class="text-gray-500 text-sm">Promedio</p>
          <p class="text-2xl font-bold text-gray-900 mt-1">
            {{ income.length ? formatCurrency(totalIncome / income.length) : formatCurrency(0) }}
          </p>
          <p class="text-gray-500 text-sm mt-2">Por transacción</p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Lista de ingresos -->
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
                      placeholder="Buscar ingresos..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <select
                  v-model="filtroCategoria"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Todas las categorías</option>
                  <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <div class="flex gap-2">
                  <button
                    @click="ordenarPor = 'fecha'; ordenAscendente = !ordenAscendente"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors',
                      ordenarPor === 'fecha' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    Fecha {{ ordenarPor === 'fecha' ? (ordenAscendente ? '↑' : '↓') : '' }}
                  </button>
                  <button
                    @click="ordenarPor = 'monto'; ordenAscendente = !ordenAscendente"
                    :class="[
                      'px-3 py-2 rounded-lg transition-colors',
                      ordenarPor === 'monto' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    ]"
                  >
                    Monto {{ ordenarPor === 'monto' ? (ordenAscendente ? '↑' : '↓') : '' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Tabla de ingresos -->
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
                    v-for="item in incomeFiltered"
                    :key="item.id"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="p-2 bg-green-100 rounded-lg">
                          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                        <span class="font-medium text-gray-900">{{ item.descripcion }}</span>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <span :class="['px-3 py-1 rounded-full text-sm font-medium', getCategoriaColor(item.categoria)]">
                        {{ item.categoria }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-gray-600">{{ formatDate(item.fecha) }}</td>
                    <td class="py-4 px-6 text-right font-semibold text-green-600">
                      +{{ formatCurrency(item.monto) }}
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex justify-center gap-2">
                        <button
                          @click="openEditModal(item)"
                          class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="deleteIncome(item.id)"
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
              <div v-if="incomeFiltered.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500">No se encontraron ingresos</p>
                <button
                  @click="openNewModal"
                  class="mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Agregar primer ingreso
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
                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${(stat.total / totalIncome) * 100}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ stat.count }} transacción(es)</p>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h3 class="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Consejos
            </h3>
            <ul class="text-sm text-green-700 space-y-2">
              <li class="flex items-start gap-2">
                <span class="text-green-500">•</span>
                Registra todos tus ingresos para un mejor control financiero
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500">•</span>
                Categoriza correctamente para obtener mejores estadísticas
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500">•</span>
                Revisa tus ingresos regularmente para detectar patrones
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para agregar/editar ingreso -->
  <Teleport to="body">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showModal = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ editingId ? 'Editar Ingreso' : 'Nuevo Ingreso' }}
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

        <form @submit.prevent="saveIncome" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              v-model="formData.descripcion"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Ej: Salario mensual"
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
                class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="formData.categoria"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              class="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {{ editingId ? 'Guardar Cambios' : 'Agregar Ingreso' }}
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
