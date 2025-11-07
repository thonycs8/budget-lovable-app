import { useEffect, useState } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdVideoProps {
  onClose?: () => void;
  showAfterSeconds?: number;
}

export function AdVideo({ onClose, showAfterSeconds = 30 }: AdVideoProps) {
  const { isPremium, loading } = usePremium();
  const [isVisible, setIsVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (loading || isPremium) return;

    // Show ad after specified seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, showAfterSeconds * 1000);

    return () => clearTimeout(showTimer);
  }, [loading, isPremium, showAfterSeconds]);

  useEffect(() => {
    if (!isVisible) return;

    // Allow closing after 5 seconds
    const closeTimer = setTimeout(() => {
      setCanClose(true);
    }, 5000);

    return () => clearTimeout(closeTimer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Don't show for premium users or while loading
  if (loading || isPremium || !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative max-w-4xl w-full bg-background rounded-lg overflow-hidden shadow-2xl">
        {canClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
        
        <div className="aspect-video w-full">
          {/* AdSense Video Ad - Replace with your ad unit */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
            data-ad-slot="YYYYYYYYYY" // Replace with your video ad slot ID
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>

        {!canClose && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
            Você pode fechar em {5} segundos...
          </div>
        )}

        <div className="p-4 text-center border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Anúncio - Apoie o gest-first assistindo
          </p>
          <p className="text-xs text-muted-foreground">
            Atualize para Premium por €2,99/mês para remover todos os anúncios
          </p>
        </div>
      </div>
    </div>
  );
}
