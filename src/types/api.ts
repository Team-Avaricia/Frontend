// Types for .NET API (Micro-Back-Brahiam) - Port 5203

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense'
}

export enum TransactionSource {
  Manual = 'Manual',
  Telegram = 'Telegram',
  WhatsApp = 'WhatsApp',
  API = 'API'
}

export enum RuleType {
  SpendingLimit = 'SpendingLimit',
  SavingsGoal = 'SavingsGoal',
  CategoryBudget = 'CategoryBudget'
}

export enum RulePeriod {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}



// ==================== REQUEST TYPES ====================

export interface CreateTransactionRequest {
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  source: TransactionSource;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  initialBalance?: number;
}

export interface CreateFinancialRuleRequest {
  userId: string;
  type: RuleType;
  category?: string;
  amountLimit: number;
  period: RulePeriod;
}



export interface SpendingValidationRequest {
  userId: string;
  amount: number;
  category: string;
  description?: string;
}

// ==================== RESPONSE TYPES ====================

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  category: string;
  description?: string;
  source: string;
  createdAt: string;
  date?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  telegramId?: number;
  telegramUsername?: string;
  currentBalance: number;
  createdAt?: string;
}

export interface FinancialRule {
  id: string;
  userId: string;
  type: string;
  category?: string;
  amountLimit: number;
  period: string;
  isActive: boolean;
  createdAt: string;
}



export interface BalanceResponse {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  lastTransactionDate?: string;
}

export interface CategorySummaryItem {
  category: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface CategorySummaryResponse {
  data: CategorySummaryItem[];
  grandTotal: number;
}

export interface TransactionQueryResponse {
  data: Transaction[];
  totalAmount: number;
  count: number;
}

export interface SpendingValidationResponse {
  isApproved: boolean;
  verdict: string;
  reason: string;
  remainingBudget: number;
}

// ==================== FINANCIAL RULE PROGRESS ====================

export interface RuleProgressResponse {
  ruleId: string;
  category: string;
  period: string;
  limit: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  periodStartDate: string;
  periodEndDate: string;
  isOverBudget: boolean;
  status: string; // "On Track", "Warning", "Over Budget"
}

// ==================== TRANSACTION SEARCH ====================

export interface TransactionSearchParams {
  query?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

// ==================== TELEGRAM INTEGRATION ====================

export interface TelegramLinkResponse {
  linkUrl: string;
  expiresAt: string;
}

export interface TelegramStatusResponse {
  isLinked: boolean;
  telegramId?: number;
  telegramUsername?: string;
  linkedAt?: string;
}

export interface LinkTelegramRequest {
  userId: string;
  telegramId: number;
  telegramUsername?: string;
}
