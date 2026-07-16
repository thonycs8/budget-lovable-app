import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore, authSelectors } from '@/stores/authStore';
import { useFinancialStore } from '@/stores/financialStore';
import { queryKeys } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook otimizado para gerenciar categorias
 * 
 * Características:
 * - Integração com React Query para cache
 * - Sincronização com Zustand store
 * - Optimistic updates
 * - Offline-first
 */
export const useOptimizedCategories = () => {
  const userId = useAuthStore(authSelectors.userId);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const {
    setCategories,
    addCategory: addCategoryToStore,
    updateCategory: updateCategoryInStore,
    removeCategory: removeCategoryFromStore,
  } = useFinancialStore();

  /**
   * Query para buscar categorias
   */
  const { data: categories = [], isLoading } = useQuery({
    queryKey: userId ? queryKeys.categories.list(userId) : [],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      
      // Sincronizar com store
      setCategories(data);
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  /**
   * Mutation para criar categoria
   */
  const createMutation = useMutation({
    mutationFn: async (categoryData: { name: string; description?: string; color?: string }) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newCategory) => {
      // Cancelar queries pendentes
      await queryClient.cancelQueries({ queryKey: queryKeys.categories.list(userId!) });

      // Snapshot do estado anterior
      const previousCategories = queryClient.getQueryData(queryKeys.categories.list(userId!));

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticCategory = {
        id: tempId,
        ...newCategory,
        user_id: userId!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        queryKeys.categories.list(userId!),
        (old: any[] = []) => [...old, optimisticCategory]
      );

      addCategoryToStore(optimisticCategory as any);

      return { previousCategories };
    },
    onError: (error, variables, context) => {
      // Rollback em caso de erro
      if (context?.previousCategories) {
        queryClient.setQueryData(
          queryKeys.categories.list(userId!),
          context.previousCategories
        );
      }
      toast({
        title: 'Erro ao criar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Categoria criada',
        description: 'A categoria foi criada com sucesso.',
      });
    },
    onSettled: () => {
      // Refetch para garantir sincronização
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.list(userId!) });
    },
  });

  /**
   * Mutation para atualizar categoria
   */
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<any> }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.categories.list(userId!) });

      const previousCategories = queryClient.getQueryData(queryKeys.categories.list(userId!));

      queryClient.setQueryData(
        queryKeys.categories.list(userId!),
        (old: any[] = []) => old.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
      );

      updateCategoryInStore(id, updates);

      return { previousCategories };
    },
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          queryKeys.categories.list(userId!),
          context.previousCategories
        );
      }
      toast({
        title: 'Erro ao atualizar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Categoria atualizada',
        description: 'A categoria foi atualizada com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.list(userId!) });
    },
  });

  /**
   * Mutation para deletar categoria
   */
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.categories.list(userId!) });

      const previousCategories = queryClient.getQueryData(queryKeys.categories.list(userId!));

      queryClient.setQueryData(
        queryKeys.categories.list(userId!),
        (old: any[] = []) => old.filter((cat) => cat.id !== id)
      );

      removeCategoryFromStore(id);

      return { previousCategories };
    },
    onError: (error, variables, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          queryKeys.categories.list(userId!),
          context.previousCategories
        );
      }
      toast({
        title: 'Erro ao deletar categoria',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Categoria deletada',
        description: 'A categoria foi deletada com sucesso.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.list(userId!) });
    },
  });

  return {
    categories,
    isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: (id: string, updates: any) => updateMutation.mutateAsync({ id, updates }),
    deleteCategory: deleteMutation.mutateAsync,
    refetch: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories.list(userId!) }),
  };
};
