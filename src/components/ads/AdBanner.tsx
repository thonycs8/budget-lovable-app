import { useEffect, useRef } from 'react';
import { usePremium } from '@/hooks/usePremium';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export function AdBanner({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}: AdBannerProps) {
  const { isPremium, loading } = usePremium();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !isPremium && adRef.current) {
      try {
        // @ts-ignore - AdSense global variable
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [loading, isPremium]);

  // Don't show ads for premium users or while loading
  if (loading || isPremium) {
    return null;
  }

  return (
    <div ref={adRef} className={`my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
}
