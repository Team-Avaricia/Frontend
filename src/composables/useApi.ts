import { ref } from 'vue';
import { mainApi } from '@/services/api';
import type {
  CreateTransactionRequest,
  CreateFinancialRuleRequest,
  CreateRecurringTransactionRequest,
  SpendingValidationRequest,
  Transaction,
  User,
  BalanceResponse,
  CashflowResponse,
  FinancialRule,
  RecurringTransaction,
  SpendingValidationResponse
} from '@/types/api';

/**
 * Composable para manejar las operaciones con usuarios
 */
export function useUsers() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentUser = ref<User | null>(null);

  const getUserById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.users.getById(id);
      currentUser.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener usuario';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserBalance = async (userId: string): Promise<BalanceResponse> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.users.getBalance(userId);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener balance';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    currentUser,
    getUserById,
    getUserBalance
  };
}

/**
 * Composable para manejar transacciones
 */
export function useTransactions() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const transactions = ref<Transaction[]>([]);

  const createTransaction = async (data: CreateTransactionRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.transactions.create(data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear transacción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserTransactions = async (userId: string, type?: 'Income' | 'Expense') => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.transactions.getByUserId(userId, type);
      transactions.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener transacciones';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTransactionsByRange = async (userId: string, startDate: string, endDate: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.transactions.getByRange(userId, startDate, endDate);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener transacciones';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTransaction = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.transactions.delete(id);
      // Eliminar de la lista local
      transactions.value = transactions.value.filter(t => t.id !== id);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar transacción';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getIncome = async (userId: string) => {
    return getUserTransactions(userId, 'Income');
  };

  const getExpenses = async (userId: string) => {
    return getUserTransactions(userId, 'Expense');
  };

  return {
    loading,
    error,
    transactions,
    createTransaction,
    getUserTransactions,
    getTransactionsByRange,
    deleteTransaction,
    getIncome,
    getExpenses
  };
}

/**
 * Composable para manejar transacciones recurrentes
 */
export function useRecurringTransactions() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const recurringTransactions = ref<RecurringTransaction[]>([]);

  const createRecurring = async (data: CreateRecurringTransactionRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.recurringTransactions.create(data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear transacción recurrente';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserRecurring = async (userId: string, type?: 'Income' | 'Expense', isActive?: boolean) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.recurringTransactions.getByUserId(userId, type, isActive);
      recurringTransactions.value = response.data.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener transacciones recurrentes';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getCashflow = async (userId: string): Promise<CashflowResponse> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.recurringTransactions.getCashflow(userId);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener flujo de caja';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleRecurring = async (id: string, isActive: boolean) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.recurringTransactions.toggle(id, { isActive });
      // Actualizar en la lista local
      const index = recurringTransactions.value.findIndex(r => r.id === id);
      if (index !== -1) {
        recurringTransactions.value[index].isActive = isActive;
      }
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al activar/pausar transacción recurrente';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRecurring = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.recurringTransactions.delete(id);
      // Eliminar de la lista local
      recurringTransactions.value = recurringTransactions.value.filter(r => r.id !== id);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar transacción recurrente';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    recurringTransactions,
    createRecurring,
    getUserRecurring,
    getCashflow,
    toggleRecurring,
    deleteRecurring
  };
}

/**
 * Composable para manejar reglas financieras
 */
export function useFinancialRules() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const rules = ref<FinancialRule[]>([]);

  const createRule = async (data: CreateFinancialRuleRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.financialRules.create(data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear regla financiera';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserRules = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.financialRules.getByUserId(userId);
      rules.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener reglas';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deactivateRule = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.financialRules.deactivate(id);
      // Actualizar en la lista local
      const index = rules.value.findIndex(r => r.id === id);
      if (index !== -1 && rules.value[index]) {
        rules.value[index].isActive = false;
      }
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al desactivar regla';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRule = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.financialRules.delete(id);
      // Eliminar de la lista local
      rules.value = rules.value.filter(r => r.id !== id);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar regla';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    rules,
    createRule,
    getUserRules,
    deactivateRule,
    deleteRule
  };
}

/**
 * Composable para validación de gastos
 */
export function useSpendingValidation() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastValidation = ref<SpendingValidationResponse | null>(null);

  const validateSpending = async (data: SpendingValidationRequest): Promise<SpendingValidationResponse> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.spendingValidation.validate(data);
      lastValidation.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al validar gasto';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    lastValidation,
    validateSpending
  };
}

