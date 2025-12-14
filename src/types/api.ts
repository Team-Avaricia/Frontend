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

export enum RecurrenceFrequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Overdue = 'Overdue'
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

export interface CreateRecurringTransactionRequest {
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string;
  frequency: RecurrenceFrequency;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  dayOfMonth?: number; // 1-31
  dayOfWeek?: number; // 0-6
}

export interface UpdateRecurringTransactionRequest {
  amount?: number;
  description?: string;
  endDate?: string; // ISO date string
}

export interface ToggleRecurringTransactionRequest {
  isActive: boolean;
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

export interface RecurringTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  category: string;
  description?: string;
  frequency: string;
  dayOfMonth?: number;
  nextExecutionDate: string;
  isActive: boolean;
  createdAt: string;
  lastPaidDate?: string;
  isPaidThisPeriod?: boolean;
  paymentStatus?: string;
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

export interface CashflowItem {
  category: string;
  amount: number;
}

export interface CashflowResponse {
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netMonthlyCashflow: number;
  incomeBreakdown: CashflowItem[];
  expenseBreakdown: CashflowItem[];
}

export interface TransactionQueryResponse {
  data: Transaction[];
  totalAmount: number;
  count: number;
}

export interface RecurringTransactionsResponse {
  data: RecurringTransaction[];
  totalMonthlyIncome: number;
  totalMonthlyExpenses: number;
}

export interface SpendingValidationResponse {
  isApproved: boolean;
  verdict: string;
  reason: string;
  remainingBudget: number;
}

