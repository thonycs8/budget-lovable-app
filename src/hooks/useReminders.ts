import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FinancialReminder {
  id: string;
  user_id: string;
  reminder_type: 'expense' | 'income' | 'payable' | 'investment' | 'prediction';
  related_id: string | null;
  title: string;
  description: string | null;
  due_date: string;
  remind_at: string;
  is_sent: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<FinancialReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchReminders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('financial_reminders')
        .select('*')
        .eq('is_dismissed', false)
        .order('remind_at', { ascending: true });

      if (error) throw error;
      setReminders((data || []) as FinancialReminder[]);
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_reminders')
        .update({ is_dismissed: true })
        .eq('id', id);

      if (error) throw error;
      
      setReminders(prev => prev.filter(rem => rem.id !== id));
      toast.success('Lembrete dispensado');
    } catch (error: any) {
      console.error('Error dismissing reminder:', error);
      toast.error('Erro ao dispensar lembrete');
    }
  };

  const getActiveReminders = () => {
    const now = new Date();
    return reminders.filter(rem => {
      const remindAt = new Date(rem.remind_at);
      return remindAt <= now && !rem.is_dismissed;
    });
  };

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  return {
    reminders,
    loading,
    dismissReminder,
    getActiveReminders,
    refetch: fetchReminders
  };
};
