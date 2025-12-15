import { ref } from 'vue';
import { mainApi } from '@/services/api';
import type {
  CreateTransactionRequest,
  CreateFinancialRuleRequest,
  SpendingValidationRequest,
  Transaction,
  User,
  BalanceResponse,
  FinancialRule,
  SpendingValidationResponse,
  RuleProgressResponse,
  TransactionSearchParams,
  TelegramStatusResponse,
  TelegramLinkResponse,
  LinkTelegramRequest,
  CategorySummaryResponse
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

/**
 * Composable para reportes y búsqueda de transacciones
 */
export function useTransactionReports() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchResults = ref<Transaction[]>([]);
  const categorySummary = ref<CategorySummaryResponse | null>(null);

  const searchTransactions = async (userId: string, params: TransactionSearchParams) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.transactions.search(userId, params);
      searchResults.value = response.data.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al buscar transacciones';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getCategorySummary = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.transactions.getCategorySummary(userId);
      categorySummary.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener resumen por categoría';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    searchResults,
    categorySummary,
    searchTransactions,
    getCategorySummary
  };
}

/**
 * Composable para progreso de reglas financieras
 */
export function useFinancialRuleProgress() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const rulesProgress = ref<RuleProgressResponse[]>([]);

  const getRuleProgress = async (ruleId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.financialRules.getProgress(ruleId);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener progreso de regla';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserRulesProgress = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.financialRules.getUserProgress(userId);
      rulesProgress.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener progreso de reglas';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    rulesProgress,
    getRuleProgress,
    getUserRulesProgress
  };
}

/**
 * Composable para configuración de Telegram
 */
export function useTelegramSettings() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const telegramStatus = ref<TelegramStatusResponse | null>(null);
  const telegramLink = ref<TelegramLinkResponse | null>(null);

  const getTelegramStatus = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.users.getTelegramStatus(userId);
      telegramStatus.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener estado de Telegram';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTelegramLink = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.users.getTelegramLink(userId);
      telegramLink.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener enlace de Telegram';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const linkTelegram = async (data: LinkTelegramRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.users.linkTelegram(data);
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al vincular Telegram';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const unlinkTelegram = async (userId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await mainApi.users.deleteTelegram(userId);
      telegramStatus.value = null;
      return response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al desvincular Telegram';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    telegramStatus,
    telegramLink,
    getTelegramStatus,
    getTelegramLink,
    linkTelegram,
    unlinkTelegram
  };
}
