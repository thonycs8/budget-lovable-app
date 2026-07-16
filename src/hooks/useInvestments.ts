import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Investment {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  current_value?: number;
  investment_type: string;
  description?: string;
  purchase_date: string;
  created_at: string;
  updated_at: string;
}

export const useInvestments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar investimentos:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar os investimentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvestment = async (investmentData: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('investments')
        .insert({
          ...investmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setInvestments(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Investimento criado com sucesso!",
      });
      return data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao criar investimento:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível criar o investimento.",
        variant: "destructive",
      });
    }
  };

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInvestments(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Sucesso",
        description: "Investimento atualizado com sucesso!",
      });
      return data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao atualizar investimento:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o investimento.",
        variant: "destructive",
      });
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvestments(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Investimento excluído com sucesso!",
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao excluir investimento:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível excluir o investimento.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvestments();

      // Subscribe to realtime updates
      const channel = supabase
        .channel('investments-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'investments',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setInvestments(prev => [payload.new as Investment, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setInvestments(prev => prev.map(item => 
                item.id === payload.new.id ? payload.new as Investment : item
              ));
            } else if (payload.eventType === 'DELETE') {
              setInvestments(prev => prev.filter(item => item.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setInvestments([]);
      setLoading(false);
    }
  }, [user]);

  return {
    investments,
    loading,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    refetch: fetchInvestments,
  };
};