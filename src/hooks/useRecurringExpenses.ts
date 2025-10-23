import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface RecurringExpense {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  amount: number;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string | null;
  last_generated_date: string | null;
  is_active: boolean;
  reminder_days_before: number;
  auto_create: boolean;
  created_at: string;
  updated_at: string;
}

export const useRecurringExpenses = () => {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecurringExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecurringExpenses((data || []) as RecurringExpense[]);
    } catch (error: any) {
      console.error('Error fetching recurring expenses:', error);
      toast.error('Erro ao carregar despesas recorrentes');
    } finally {
      setLoading(false);
    }
  };

  const createRecurringExpense = async (expense: Omit<RecurringExpense, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_generated_date'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .insert([{ ...expense, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setRecurringExpenses(prev => [data as RecurringExpense, ...prev]);
      toast.success('Despesa recorrente criada com sucesso');
      return data;
    } catch (error: any) {
      console.error('Error creating recurring expense:', error);
      toast.error('Erro ao criar despesa recorrente');
      throw error;
    }
  };

  const updateRecurringExpense = async (id: string, updates: Partial<RecurringExpense>) => {
    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setRecurringExpenses(prev => 
        prev.map(exp => exp.id === id ? data as RecurringExpense : exp)
      );
      toast.success('Despesa recorrente atualizada');
      return data;
    } catch (error: any) {
      console.error('Error updating recurring expense:', error);
      toast.error('Erro ao atualizar despesa recorrente');
      throw error;
    }
  };

  const deleteRecurringExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recurring_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRecurringExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Despesa recorrente removida');
    } catch (error: any) {
      console.error('Error deleting recurring expense:', error);
      toast.error('Erro ao remover despesa recorrente');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecurringExpenses();
    }
  }, [user]);

  return {
    recurringExpenses,
    loading,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
    refetch: fetchRecurringExpenses
  };
};
