import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type {
  CreateTransactionRequest,
  CreateUserRequest,
  CreateFinancialRuleRequest,
  CreateRecurringTransactionRequest,
  UpdateRecurringTransactionRequest,
  ToggleRecurringTransactionRequest,
  SpendingValidationRequest,
  Transaction,
  User,
  FinancialRule,
  RecurringTransaction,
  BalanceResponse,
  CategorySummaryResponse,
  CashflowResponse,
  TransactionQueryResponse,
  RecurringTransactionsResponse,
  SpendingValidationResponse
} from '@/types/api';

// API de autenticación - Spring Boot (puerto 8080)
const authApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API principal - .NET (puerto 5203)
const mainApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_MAIN_API_URL || 'http://localhost:5203/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token en cada petición - Auth API
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para agregar el token en cada petición - Main API
mainApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta - Auth API
authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta - Main API
mainApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio de autenticación (Spring Boot - puerto 8080)
export const authApi = {
  // POST /api/auth/login
  // El backend usa 'username' pero acepta email, así que enviamos email como username
  async login(email: string, password: string): Promise<AxiosResponse> {
    return authApiClient.post('/auth/login', { username: email, password });
  },

  // POST /api/auth/register
  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return authApiClient.post('/auth/register', data);
  },

  // OAuth2 URLs - Redirige al backend para iniciar el flujo OAuth
  oauth2: {
    // URL base del backend de autenticación (sin /api)
    getBaseUrl: () => {
      const apiUrl = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080/api';
      return apiUrl.replace('/api', '');
    },

    // Iniciar login con Google
    googleLogin: () => {
      const baseUrl = authApi.oauth2.getBaseUrl();
      window.location.href = `${baseUrl}/oauth2/authorization/google`;
    },

    // Iniciar login con Microsoft
    microsoftLogin: () => {
      const baseUrl = authApi.oauth2.getBaseUrl();
      window.location.href = `${baseUrl}/oauth2/authorization/microsoft`;
    },
  },
};

// Servicio principal (.NET - puerto 5203)
export const mainApi = {
  // ===== Endpoints de Usuario =====
  users: {
    // POST /api/User - Crear nuevo usuario
    create: (data: CreateUserRequest): Promise<AxiosResponse<User>> => {
      return mainApiClient.post('/User', data);
    },

    // GET /api/User/{id} - Obtener usuario por ID
    getById: (id: string): Promise<AxiosResponse<User>> => {
      return mainApiClient.get(`/User/${id}`);
    },

    // GET /api/User/email/{email} - Obtener usuario por email
    getByEmail: (email: string): Promise<AxiosResponse<User>> => {
      return mainApiClient.get(`/User/email/${email}`);
    },

    // GET /api/User/phone/{phoneNumber} - Obtener usuario por teléfono
    getByPhone: (phoneNumber: string): Promise<AxiosResponse<User>> => {
      return mainApiClient.get(`/User/phone/${phoneNumber}`);
    },

    // GET /api/User/telegram/{telegramId} - Obtener usuario por Telegram ID
    getByTelegramId: (telegramId: number): Promise<AxiosResponse<User>> => {
      return mainApiClient.get(`/User/telegram/${telegramId}`);
    },

    // GET /api/User/{userId}/telegram - Obtener Telegram ID del usuario
    getUserTelegramId: (userId: string): Promise<AxiosResponse<{ telegramId: number }>> => {
      return mainApiClient.get(`/User/${userId}/telegram`);
    },

    // GET /api/User/{userId}/balance - Obtener balance del usuario
    getBalance: (userId: string): Promise<AxiosResponse<BalanceResponse>> => {
      return mainApiClient.get(`/User/${userId}/balance`);
    },
  },

  // ===== Endpoints de Transacciones =====
  transactions: {
    // POST /api/Transaction - Crear nueva transacción
    create: (data: CreateTransactionRequest): Promise<AxiosResponse<Transaction>> => {
      return mainApiClient.post('/Transaction', data);
    },

    // GET /api/Transaction/{id} - Obtener transacción por ID
    getById: (id: string): Promise<AxiosResponse<Transaction>> => {
      return mainApiClient.get(`/Transaction/${id}`);
    },

    // GET /api/Transaction/user/{userId} - Obtener transacciones del usuario
    getByUserId: (userId: string, type?: 'Income' | 'Expense'): Promise<AxiosResponse<Transaction[]>> => {
      const params = type ? { type } : {};
      return mainApiClient.get(`/Transaction/user/${userId}`, { params });
    },

    // GET /api/Transaction/user/{userId}/range - Obtener transacciones por rango de fechas
    getByRange: (
      userId: string,
      startDate: string,
      endDate: string
    ): Promise<AxiosResponse<TransactionQueryResponse>> => {
      return mainApiClient.get(`/Transaction/user/${userId}/range`, {
        params: { startDate, endDate }
      });
    },

    // GET /api/Transaction/user/{userId}/date/{date} - Obtener transacciones por fecha específica
    getByDate: (userId: string, date: string): Promise<AxiosResponse<TransactionQueryResponse>> => {
      return mainApiClient.get(`/Transaction/user/${userId}/date/${date}`);
    },

    // DELETE /api/Transaction/{id} - Eliminar transacción
    delete: (id: string): Promise<AxiosResponse<{ message: string }>> => {
      return mainApiClient.delete(`/Transaction/${id}`);
    },

    // Helper: Obtener solo ingresos
    getIncome: (userId: string): Promise<AxiosResponse<Transaction[]>> => {
      return mainApiClient.get(`/Transaction/user/${userId}`, { params: { type: 'Income' } });
    },

    // Helper: Obtener solo gastos
    getExpenses: (userId: string): Promise<AxiosResponse<Transaction[]>> => {
      return mainApiClient.get(`/Transaction/user/${userId}`, { params: { type: 'Expense' } });
    },
  },

  // ===== Endpoints de Transacciones Recurrentes =====
  recurringTransactions: {
    // POST /api/RecurringTransaction - Crear transacción recurrente
    create: (data: CreateRecurringTransactionRequest): Promise<AxiosResponse<RecurringTransaction>> => {
      return mainApiClient.post('/RecurringTransaction', data);
    },

    // GET /api/RecurringTransaction/user/{userId} - Obtener transacciones recurrentes del usuario
    getByUserId: (
      userId: string,
      type?: 'Income' | 'Expense',
      isActive?: boolean
    ): Promise<AxiosResponse<RecurringTransactionsResponse>> => {
      const params: Record<string, string | boolean> = {};
      if (type) params.type = type;
      if (isActive !== undefined) params.isActive = isActive;
      return mainApiClient.get(`/RecurringTransaction/user/${userId}`, { params });
    },

    // GET /api/RecurringTransaction/user/{userId}/cashflow - Obtener flujo de caja mensual
    getCashflow: (userId: string): Promise<AxiosResponse<CashflowResponse>> => {
      return mainApiClient.get(`/RecurringTransaction/user/${userId}/cashflow`);
    },

    // PUT /api/RecurringTransaction/{id} - Actualizar transacción recurrente
    update: (
      id: string,
      data: UpdateRecurringTransactionRequest
    ): Promise<AxiosResponse<{ message: string }>> => {
      return mainApiClient.put(`/RecurringTransaction/${id}`, data);
    },

    // PATCH /api/RecurringTransaction/{id}/toggle - Activar/pausar transacción recurrente
    toggle: (
      id: string,
      data: ToggleRecurringTransactionRequest
    ): Promise<AxiosResponse<{ id: string; isActive: boolean; message: string }>> => {
      return mainApiClient.patch(`/RecurringTransaction/${id}/toggle`, data);
    },

    // DELETE /api/RecurringTransaction/{id} - Eliminar transacción recurrente
    delete: (id: string): Promise<AxiosResponse<{ success: boolean; message: string }>> => {
      return mainApiClient.delete(`/RecurringTransaction/${id}`);
    },
  },

  // ===== Endpoints de Reglas Financieras =====
  financialRules: {
    // POST /api/FinancialRule - Crear regla financiera
    create: (data: CreateFinancialRuleRequest): Promise<AxiosResponse<FinancialRule>> => {
      return mainApiClient.post('/FinancialRule', data);
    },

    // GET /api/FinancialRule/{id} - Obtener regla por ID
    getById: (id: string): Promise<AxiosResponse<FinancialRule>> => {
      return mainApiClient.get(`/FinancialRule/${id}`);
    },

    // GET /api/FinancialRule/user/{userId} - Obtener reglas activas del usuario
    getByUserId: (userId: string): Promise<AxiosResponse<FinancialRule[]>> => {
      return mainApiClient.get(`/FinancialRule/user/${userId}`);
    },

    // PATCH /api/FinancialRule/{id}/deactivate - Desactivar regla
    deactivate: (id: string): Promise<AxiosResponse<{ message: string }>> => {
      return mainApiClient.patch(`/FinancialRule/${id}/deactivate`);
    },

    // DELETE /api/FinancialRule/{id} - Eliminar regla
    delete: (id: string): Promise<AxiosResponse<{ message: string }>> => {
      return mainApiClient.delete(`/FinancialRule/${id}`);
    },
  },

  // ===== Endpoints de Validación de Gastos =====
  spendingValidation: {
    // POST /api/SpendingValidation/validate - Validar un gasto propuesto
    validate: (data: SpendingValidationRequest): Promise<AxiosResponse<SpendingValidationResponse>> => {
      return mainApiClient.post('/SpendingValidation/validate', data);
    },
  },
};

// Exportar los clientes para uso directo si es necesario
export { authApiClient, mainApiClient };

// Exportar por defecto el servicio principal para compatibilidad
export default mainApi;

