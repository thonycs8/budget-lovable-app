import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  payment_reminders: boolean;
  weekly_summary: boolean;
  language: string;
  date_format: string;
  number_format: string;
  budget_alerts: boolean;
  investment_alerts: boolean;
  created_at: string;
  updated_at: string;
}

export function useSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if they don't exist
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
          })
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error fetching settings:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      toast({
        title: "Configurações atualizadas",
        description: "Suas preferências foram salvas com sucesso.",
      });
      
      return { data, error: null };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error updating settings:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings,
  };
}
