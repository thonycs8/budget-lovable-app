import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/**
 * Tipos para dados financeiros
 */
interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Expense {
  id: string;
  amount: number;
  date: string;
  title: string;
  category_id?: string;
}

interface Income {
  id: string;
  amount: number;
  date: string;
  title: string;
  category_id?: string;
}

interface Investment {
  id: string;
  amount: number;
  current_value?: number;
  title: string;
  investment_type: string;
}

interface Payable {
  id: string;
  amount: number;
  due_date: string;
  title: string;
  is_paid: boolean;
}

/**
 * Estado financeiro global
 */
interface FinancialState {
  categories: Category[];
  expenses: Expense[];
  income: Income[];
  investments: Investment[];
  payables: Payable[];
  
  // Status de sincronização
  lastSync: number | null;
  isSyncing: boolean;
  pendingChanges: number;
  
  // Filtros e visualizações
  selectedPeriod: 'day' | 'week' | 'month' | 'year';
  selectedCategory: string | null;
}

/**
 * Ações para manipular dados financeiros
 */
interface FinancialActions {
  // Categories
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  
  // Expenses
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  
  // Income
  setIncome: (income: Income[]) => void;
  addIncome: (income: Income) => void;
  updateIncome: (id: string, data: Partial<Income>) => void;
  removeIncome: (id: string) => void;
  
  // Investments
  setInvestments: (investments: Investment[]) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (id: string, data: Partial<Investment>) => void;
  removeInvestment: (id: string) => void;
  
  // Payables
  setPayables: (payables: Payable[]) => void;
  addPayable: (payable: Payable) => void;
  updatePayable: (id: string, data: Partial<Payable>) => void;
  removePayable: (id: string) => void;
  
  // Sync
  setSyncing: (syncing: boolean) => void;
  markSynced: () => void;
  incrementPendingChanges: () => void;
  
  // Filters
  setSelectedPeriod: (period: FinancialState['selectedPeriod']) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  
  // Reset
  reset: () => void;
}

const initialState: FinancialState = {
  categories: [],
  expenses: [],
  income: [],
  investments: [],
  payables: [],
  lastSync: null,
  isSyncing: false,
  pendingChanges: 0,
  selectedPeriod: 'month',
  selectedCategory: null,
};

/**
 * Store Zustand para dados financeiros
 * 
 * Características:
 * - Persistência em localStorage com sincronização
 * - Immer para atualizações imutáveis
 * - Rastreamento de mudanças pendentes
 * - Seletores otimizados
 */
export const useFinancialStore = create<FinancialState & FinancialActions>()(
  persist(
    immer((set) => ({
      ...initialState,

      // Categories
      setCategories: (categories) =>
        set((state) => {
          state.categories = categories;
        }),
      addCategory: (category) =>
        set((state) => {
          state.categories.push(category);
          state.pendingChanges++;
        }),
      updateCategory: (id, data) =>
        set((state) => {
          const index = state.categories.findIndex((c) => c.id === id);
          if (index !== -1) {
            state.categories[index] = { ...state.categories[index], ...data };
            state.pendingChanges++;
          }
        }),
      removeCategory: (id) =>
        set((state) => {
          state.categories = state.categories.filter((c) => c.id !== id);
          state.pendingChanges++;
        }),

      // Expenses
      setExpenses: (expenses) =>
        set((state) => {
          state.expenses = expenses;
        }),
      addExpense: (expense) =>
        set((state) => {
          state.expenses.push(expense);
          state.pendingChanges++;
        }),
      updateExpense: (id, data) =>
        set((state) => {
          const index = state.expenses.findIndex((e) => e.id === id);
          if (index !== -1) {
            state.expenses[index] = { ...state.expenses[index], ...data };
            state.pendingChanges++;
          }
        }),
      removeExpense: (id) =>
        set((state) => {
          state.expenses = state.expenses.filter((e) => e.id !== id);
          state.pendingChanges++;
        }),

      // Income
      setIncome: (income) =>
        set((state) => {
          state.income = income;
        }),
      addIncome: (income) =>
        set((state) => {
          state.income.push(income);
          state.pendingChanges++;
        }),
      updateIncome: (id, data) =>
        set((state) => {
          const index = state.income.findIndex((i) => i.id === id);
          if (index !== -1) {
            state.income[index] = { ...state.income[index], ...data };
            state.pendingChanges++;
          }
        }),
      removeIncome: (id) =>
        set((state) => {
          state.income = state.income.filter((i) => i.id !== id);
          state.pendingChanges++;
        }),

      // Investments
      setInvestments: (investments) =>
        set((state) => {
          state.investments = investments;
        }),
      addInvestment: (investment) =>
        set((state) => {
          state.investments.push(investment);
          state.pendingChanges++;
        }),
      updateInvestment: (id, data) =>
        set((state) => {
          const index = state.investments.findIndex((inv) => inv.id === id);
          if (index !== -1) {
            state.investments[index] = { ...state.investments[index], ...data };
            state.pendingChanges++;
          }
        }),
      removeInvestment: (id) =>
        set((state) => {
          state.investments = state.investments.filter((inv) => inv.id !== id);
          state.pendingChanges++;
        }),

      // Payables
      setPayables: (payables) =>
        set((state) => {
          state.payables = payables;
        }),
      addPayable: (payable) =>
        set((state) => {
          state.payables.push(payable);
          state.pendingChanges++;
        }),
      updatePayable: (id, data) =>
        set((state) => {
          const index = state.payables.findIndex((p) => p.id === id);
          if (index !== -1) {
            state.payables[index] = { ...state.payables[index], ...data };
            state.pendingChanges++;
          }
        }),
      removePayable: (id) =>
        set((state) => {
          state.payables = state.payables.filter((p) => p.id !== id);
          state.pendingChanges++;
        }),

      // Sync
      setSyncing: (syncing) =>
        set((state) => {
          state.isSyncing = syncing;
        }),
      markSynced: () =>
        set((state) => {
          state.lastSync = Date.now();
          state.pendingChanges = 0;
          state.isSyncing = false;
        }),
      incrementPendingChanges: () =>
        set((state) => {
          state.pendingChanges++;
        }),

      // Filters
      setSelectedPeriod: (period) =>
        set((state) => {
          state.selectedPeriod = period;
        }),
      setSelectedCategory: (categoryId) =>
        set((state) => {
          state.selectedCategory = categoryId;
        }),

      // Reset
      reset: () =>
        set(initialState),
    })),
    {
      name: 'gestfin-financial-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persistir todos os dados financeiros
        categories: state.categories,
        expenses: state.expenses,
        income: state.income,
        investments: state.investments,
        payables: state.payables,
        lastSync: state.lastSync,
        pendingChanges: state.pendingChanges,
        selectedPeriod: state.selectedPeriod,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);

/**
 * Seletores otimizados com computações derivadas
 */
export const financialSelectors = {
  // Totais
  totalExpenses: (state: FinancialState) =>
    state.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
  
  totalIncome: (state: FinancialState) =>
    state.income.reduce((sum, inc) => sum + Number(inc.amount), 0),
  
  totalInvestments: (state: FinancialState) =>
    state.investments.reduce((sum, inv) => sum + Number(inv.amount), 0),
  
  totalPayables: (state: FinancialState) =>
    state.payables
      .filter((p) => !p.is_paid)
      .reduce((sum, pay) => sum + Number(pay.amount), 0),
  
  // Balance
  balance: (state: FinancialState) => {
    const income = financialSelectors.totalIncome(state);
    const expenses = financialSelectors.totalExpenses(state);
    return income - expenses;
  },
  
  // Status de sincronização
  needsSync: (state: FinancialState) => state.pendingChanges > 0,
  
  syncStatus: (state: FinancialState) => ({
    isSyncing: state.isSyncing,
    lastSync: state.lastSync,
    pendingChanges: state.pendingChanges,
    needsSync: state.pendingChanges > 0,
  }),
};
