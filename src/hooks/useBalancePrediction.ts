import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BalancePrediction {
  date: string;
  predicted_balance: number;
  confidence: number;
}

export interface ModelStats {
  slope: number;
  intercept: number;
  r_squared: number;
  confidence_score: number;
  data_points: number;
  current_balance: number;
}

export interface HistoricalBalance {
  date: string;
  balance: number;
}

export const useBalancePrediction = () => {
  const [predictions, setPredictions] = useState<BalancePrediction[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalBalance[]>([]);
  const [modelStats, setModelStats] = useState<ModelStats | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePredictions = async (daysAhead: number = 30) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-balance', {
        body: { days_ahead: daysAhead }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.message || 'Erro ao gerar previsões');
        return;
      }

      setPredictions(data.predictions || []);
      setHistoricalData(data.historical_data || []);
      setModelStats(data.model_stats || null);
      
      toast.success(`${data.predictions?.length || 0} previsões de saldo geradas`);
    } catch (error: any) {
      console.error('Error generating predictions:', error);
      toast.error('Erro ao gerar previsões de saldo');
    } finally {
      setLoading(false);
    }
  };

  return {
    predictions,
    historicalData,
    modelStats,
    loading,
    generatePredictions
  };
};
