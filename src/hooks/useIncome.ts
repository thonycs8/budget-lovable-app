import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Income {
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

export const useIncome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [income, setIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncome = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('income')
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
      setIncome(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar receitas:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar as receitas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createIncome = async (incomeData: Omit<Income, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categories'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('income')
        .insert({
          ...incomeData,
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

      setIncome(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Receita criada com sucesso!",
      });
      return data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao criar receita:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível criar a receita.",
        variant: "destructive",
      });
    }
  };

  const updateIncome = async (id: string, updates: Partial<Income>) => {
    try {
      const { data, error } = await supabase
        .from('income')
        .update({ ...updates, categories: undefined } as any)
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

      setIncome(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Sucesso",
        description: "Receita atualizada com sucesso!",
      });
      return data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao atualizar receita:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a receita.",
        variant: "destructive",
      });
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIncome(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Receita excluída com sucesso!",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao excluir receita:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível excluir a receita.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchIncome();

      // Subscribe to realtime updates
      const channel = supabase
        .channel(`income-changes-${user.id}-${Math.random().toString(36).slice(2)}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'income',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setIncome(prev => [payload.new as Income, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setIncome(prev => prev.map(item => 
                item.id === payload.new.id ? payload.new as Income : item
              ));
            } else if (payload.eventType === 'DELETE') {
              setIncome(prev => prev.filter(item => item.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setIncome([]);
      setLoading(false);
    }
  }, [user]);

  return {
    income,
    loading,
    createIncome,
    updateIncome,
    deleteIncome,
    refetch: fetchIncome,
  };
};