import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to check if user has premium subscription
 * For now returns false by default - will be integrated with payment system
 * To test ads: user is free by default
 * To test premium (no ads): modify this hook to return true
 */
export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // For now, all users are free users (will see ads)
    // TODO: Integrate with Stripe or payment system
    setIsPremium(false);
    setLoading(false);
  }, [user]);

  return { isPremium, loading };
}
