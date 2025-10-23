import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Expense {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  };
}

export const useExpenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao carregar despesas:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar as despesas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categories'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          ...expenseData,
          user_id: user.id,
        })
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Despesa criada com sucesso!",
      });
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao criar despesa:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível criar a despesa.",
        variant: "destructive",
      });
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .single();

      if (error) throw error;

      setExpenses(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Sucesso",
        description: "Despesa atualizada com sucesso!",
      });
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao atualizar despesa:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a despesa.",
        variant: "destructive",
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso!",
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao excluir despesa:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível excluir a despesa.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return {
    expenses,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
};