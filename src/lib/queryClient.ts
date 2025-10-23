import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração otimizada do React Query para GestFin
 * 
 * Características:
 * - Persistência offline com retry automático
 * - Cache inteligente com revalidação
 * - Garbage collection otimizado
 * - Network-aware para sincronização
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache e revalidação
      staleTime: 5 * 60 * 1000, // 5 minutos - dados são "frescos" por 5min
      gcTime: 10 * 60 * 1000, // 10 minutos - garbage collection após 10min
      
      // Revalidação automática
      refetchOnWindowFocus: true, // Atualiza ao focar na janela
      refetchOnReconnect: true, // Atualiza ao reconectar
      refetchOnMount: true, // Atualiza ao montar componente
      
      // Retry inteligente para modo offline
      retry: (failureCount, error: any) => {
        // Não fazer retry em erros de autenticação
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry até 3 vezes para outros erros
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Network mode - continue funcionando offline
      networkMode: 'offlineFirst', // Tenta cache primeiro, depois rede
    },
    mutations: {
      // Retry para mutações
      retry: 1,
      retryDelay: 1000,
      
      // Network mode para mutações
      networkMode: 'offlineFirst',
      
      // Callbacks globais para mutações
      onError: (error: any) => {
        if (import.meta.env.DEV) {
          console.error('[Mutation Error]:', error);
        }
      },
    },
  },
});

/**
 * Query keys centralizados para facilitar invalidação
 */
export const queryKeys = {
  // Autenticação
  auth: {
    user: ['auth', 'user'] as const,
    session: ['auth', 'session'] as const,
  },
  
  // Perfil
  profile: {
    all: ['profile'] as const,
    detail: (userId: string) => ['profile', userId] as const,
  },
  
  // Configurações
  settings: {
    all: ['settings'] as const,
    user: (userId: string) => ['settings', userId] as const,
  },
  
  // Categorias
  categories: {
    all: ['categories'] as const,
    list: (userId: string) => ['categories', 'list', userId] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  
  // Despesas
  expenses: {
    all: ['expenses'] as const,
    list: (userId: string) => ['expenses', 'list', userId] as const,
    byCategory: (categoryId: string) => ['expenses', 'category', categoryId] as const,
    byDateRange: (start: string, end: string) => ['expenses', 'range', start, end] as const,
  },
  
  // Receitas
  income: {
    all: ['income'] as const,
    list: (userId: string) => ['income', 'list', userId] as const,
    byCategory: (categoryId: string) => ['income', 'category', categoryId] as const,
    byDateRange: (start: string, end: string) => ['income', 'range', start, end] as const,
  },
  
  // Investimentos
  investments: {
    all: ['investments'] as const,
    list: (userId: string) => ['investments', 'list', userId] as const,
    detail: (id: string) => ['investments', 'detail', id] as const,
  },
  
  // Contas a pagar
  payables: {
    all: ['payables'] as const,
    list: (userId: string) => ['payables', 'list', userId] as const,
    pending: (userId: string) => ['payables', 'pending', userId] as const,
    paid: (userId: string) => ['payables', 'paid', userId] as const,
  },
} as const;

/**
 * Helpers para invalidação de queries
 */
export const invalidateQueries = {
  // Invalidar todas as queries de um usuário
  allUserData: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.expenses.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.income.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.investments.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.payables.list(userId) });
  },
  
  // Invalidar dados financeiros
  financialData: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.expenses.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.income.list(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.investments.list(userId) });
  },
};
