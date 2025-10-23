import { useSyncIndicator } from '@/lib/offlineSync';
import { Badge } from '@/components/ui/badge';

/**
 * Componente visual para exibir status de sincronização
 */
export const SyncIndicator = () => {
  const status = useSyncIndicator();

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{status.icon}</span>
      <Badge variant={status.variant} className="text-xs">
        {status.message}
      </Badge>
    </div>
  );
};
