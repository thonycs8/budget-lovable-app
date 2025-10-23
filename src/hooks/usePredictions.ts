import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ExpensePrediction {
  id: string;
  user_id: string;
  category_id: string | null;
  predicted_amount: number;
  predicted_date: string;
  confidence_score: number | null;
  prediction_source: 'recurring' | 'pattern' | 'manual';
  is_confirmed: boolean;
  confirmed_expense_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<ExpensePrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPredictions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expense_predictions')
        .select('*')
        .gte('predicted_date', new Date().toISOString().split('T')[0])
        .order('predicted_date', { ascending: true });

      if (error) throw error;
      setPredictions((data || []) as ExpensePrediction[]);
    } catch (error: any) {
      console.error('Error fetching predictions:', error);
      toast.error('Erro ao carregar previsões');
    } finally {
      setLoading(false);
    }
  };

  const generatePredictions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-predictions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      
      toast.success(`${data.generated || 0} previsões geradas com sucesso`);
      await fetchPredictions();
      return data;
    } catch (error: any) {
      console.error('Error generating predictions:', error);
      toast.error('Erro ao gerar previsões');
      throw error;
    }
  };

  const confirmPrediction = async (predictionId: string, expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expense_predictions')
        .update({ 
          is_confirmed: true, 
          confirmed_expense_id: expenseId 
        })
        .eq('id', predictionId);

      if (error) throw error;
      
      setPredictions(prev => 
        prev.map(pred => 
          pred.id === predictionId 
            ? { ...pred, is_confirmed: true, confirmed_expense_id: expenseId }
            : pred
        )
      );
      toast.success('Previsão confirmada');
    } catch (error: any) {
      console.error('Error confirming prediction:', error);
      toast.error('Erro ao confirmar previsão');
      throw error;
    }
  };

  const deletePrediction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expense_predictions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPredictions(prev => prev.filter(pred => pred.id !== id));
      toast.success('Previsão removida');
    } catch (error: any) {
      console.error('Error deleting prediction:', error);
      toast.error('Erro ao remover previsão');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPredictions();
    }
  }, [user]);

  return {
    predictions,
    loading,
    generatePredictions,
    confirmPrediction,
    deletePrediction,
    refetch: fetchPredictions
  };
};
