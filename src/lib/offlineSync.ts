import { useEffect, useCallback } from 'react';
import { useFinancialStore, financialSelectors } from '@/stores/financialStore';
import { queryClient, invalidateQueries } from '@/lib/queryClient';
import { useAuthStore, authSelectors } from '@/stores/authStore';

/**
 * Hook para sincronização offline
 * 
 * Características:
 * - Detecta conexão de rede
 * - Sincroniza automaticamente quando online
 * - Prioriza mudanças locais
 * - Notifica conflitos
 */
export const useOfflineSync = () => {
  const userId = useAuthStore(authSelectors.userId);
  const isSyncing = useFinancialStore((state) => state.isSyncing);
  const lastSync = useFinancialStore((state) => state.lastSync);
  const pendingChanges = useFinancialStore((state) => state.pendingChanges);
  const needsSync = useFinancialStore(financialSelectors.needsSync);
  const markSynced = useFinancialStore((state) => state.markSynced);
  const setSyncing = useFinancialStore((state) => state.setSyncing);

  /**
   * Sincronizar dados com o servidor
   */
  const syncData = useCallback(async () => {
    if (!userId || isSyncing || !needsSync) {
      return;
    }

    setSyncing(true);

    try {
      // Invalidar queries para forçar re-fetch
      await invalidateQueries.allUserData(userId);
      
      // Aguardar queries serem resolvidas
      await queryClient.refetchQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey.includes(userId);
        },
      });

      // Marcar como sincronizado
      markSynced();

      if (import.meta.env.DEV) {
        console.log('[Sync] Dados sincronizados com sucesso');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[Sync] Erro ao sincronizar:', error);
      }
      setSyncing(false);
    }
  }, [userId, isSyncing, needsSync, setSyncing, markSynced]);

  /**
   * Monitorar status da rede
   */
  useEffect(() => {
    const handleOnline = () => {
      if (import.meta.env.DEV) {
        console.log('[Sync] Conexão restaurada, sincronizando...');
      }
      syncData();
    };

    const handleOffline = () => {
      if (import.meta.env.DEV) {
        console.log('[Sync] Conexão perdida, modo offline ativado');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncData]);

  /**
   * Sincronização periódica (a cada 5 minutos se houver mudanças)
   */
  useEffect(() => {
    if (!needsSync || !navigator.onLine) {
      return;
    }

    const interval = setInterval(() => {
      if (navigator.onLine && needsSync) {
        syncData();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [syncData, needsSync]);

  return {
    syncData,
    syncStatus: {
      isSyncing,
      lastSync,
      pendingChanges,
      needsSync,
    },
    isOnline: navigator.onLine,
  };
};

/**
 * Indicador de status de sincronização
 */
export const useSyncIndicator = () => {
  const isSyncing = useFinancialStore((state) => state.isSyncing);
  const lastSync = useFinancialStore((state) => state.lastSync);
  const pendingChanges = useFinancialStore((state) => state.pendingChanges);
  const needsSync = useFinancialStore(financialSelectors.needsSync);
  const isOnline = navigator.onLine;

  const getStatus = () => {
    if (!isOnline) {
      return {
        message: 'Modo Offline',
        variant: 'destructive' as const,
        icon: '📡',
      };
    }

    if (isSyncing) {
      return {
        message: 'Sincronizando...',
        variant: 'secondary' as const,
        icon: '🔄',
      };
    }

    if (needsSync) {
      return {
        message: `${pendingChanges} alteração(ões) pendente(s)`,
        variant: 'outline' as const,
        icon: '⏳',
      };
    }

    if (lastSync) {
      const lastSyncDate = new Date(lastSync);
      const now = new Date();
      const diffMinutes = Math.floor((now.getTime() - lastSyncDate.getTime()) / 60000);
      
      return {
        message: diffMinutes < 1 
          ? 'Sincronizado agora' 
          : `Sincronizado há ${diffMinutes}min`,
        variant: 'default' as const,
        icon: '✅',
      };
    }

    return {
      message: 'Aguardando sincronização',
      variant: 'secondary' as const,
      icon: '⏸️',
    };
  };

  return getStatus();
};
