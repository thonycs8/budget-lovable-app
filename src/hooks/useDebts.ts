import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { authSelectors } from '@/stores/authStore';
import { toast } from 'sonner';

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_amount: number;
  remaining_amount: number;
  interest_rate: number;
  monthly_payment: number;
  start_date: string;
  end_date?: string;
  category: 'personal_loan' | 'mortgage' | 'car_loan' | 'credit_card' | 'other';
  status: 'active' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
}

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore(authSelectors.userId);

  const fetchDebts = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDebts((data || []) as Debt[]);
    } catch (error: any) {
      console.error('Error fetching debts:', error);
      toast.error('Erro ao carregar dívidas');
    } finally {
      setLoading(false);
    }
  };

  const createDebt = async (debt: Omit<Debt, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('debts')
        .insert([{ ...debt, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setDebts([data as Debt, ...debts]);
      toast.success('Dívida cadastrada com sucesso');
      return data as Debt;
    } catch (error: any) {
      console.error('Error creating debt:', error);
      toast.error('Erro ao cadastrar dívida');
      throw error;
    }
  };

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    try {
      const { data, error } = await supabase
        .from('debts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDebts(debts.map(d => d.id === id ? data as Debt : d));
      toast.success('Dívida atualizada com sucesso');
      return data as Debt;
    } catch (error: any) {
      console.error('Error updating debt:', error);
      toast.error('Erro ao atualizar dívida');
      throw error;
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('debts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDebts(debts.filter(d => d.id !== id));
      toast.success('Dívida removida com sucesso');
    } catch (error: any) {
      console.error('Error deleting debt:', error);
      toast.error('Erro ao remover dívida');
      throw error;
    }
  };

  const registerPayment = async (debtId: string, amount: number) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    const newRemaining = Math.max(0, debt.remaining_amount - amount);
    const status = newRemaining === 0 ? 'paid' : debt.status;

    return updateDebt(debtId, { 
      remaining_amount: newRemaining,
      status,
      end_date: newRemaining === 0 ? new Date().toISOString() : debt.end_date
    });
  };

  useEffect(() => {
    fetchDebts();
  }, [userId]);

  return {
    debts,
    loading,
    createDebt,
    updateDebt,
    deleteDebt,
    registerPayment,
    refetch: fetchDebts,
  };
}
