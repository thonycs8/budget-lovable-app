import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Payable {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  amount: number;
  description?: string;
  due_date: string;
  is_paid: boolean;
  paid_date?: string;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  };
}

export const usePayables = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payables, setPayables] = useState<Payable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayables = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('payables')
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setPayables(data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao carregar contas a pagar:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contas a pagar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayable = async (payableData: Omit<Payable, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'categories'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payables')
        .insert({
          ...payableData,
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

      setPayables(prev => [...prev, data].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
      toast({
        title: "Sucesso",
        description: "Conta a pagar criada com sucesso!",
      });
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao criar conta a pagar:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível criar a conta a pagar.",
        variant: "destructive",
      });
    }
  };

  const updatePayable = async (id: string, updates: Partial<Payable>) => {
    try {
      const { data, error } = await supabase
        .from('payables')
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

      setPayables(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Sucesso",
        description: "Conta a pagar atualizada com sucesso!",
      });
      return data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao atualizar conta a pagar:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a conta a pagar.",
        variant: "destructive",
      });
    }
  };

  const deletePayable = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPayables(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Conta a pagar excluída com sucesso!",
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao excluir conta a pagar:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conta a pagar.",
        variant: "destructive",
      });
    }
  };

  const markAsPaid = async (id: string) => {
    await updatePayable(id, { 
      is_paid: true, 
      paid_date: new Date().toISOString().split('T')[0] 
    });
  };

  const markAsUnpaid = async (id: string) => {
    await updatePayable(id, { 
      is_paid: false, 
      paid_date: null 
    });
  };

  useEffect(() => {
    fetchPayables();
  }, [user]);

  return {
    payables,
    loading,
    createPayable,
    updatePayable,
    deletePayable,
    markAsPaid,
    markAsUnpaid,
    refetch: fetchPayables,
  };
};