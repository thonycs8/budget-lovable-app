import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { usePayables } from '@/hooks/usePayables';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const payableSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  due_date: z.date(),
  category_id: z.string().optional(),
  is_paid: z.boolean().default(false),
  description: z.string().optional(),
});

type PayableFormData = z.infer<typeof payableSchema>;

interface PayableFormProps {
  onSuccess?: () => void;
}

export function PayableForm({ onSuccess }: PayableFormProps) {
  const { user } = useAuth();
  const { categories } = useCategories();
  const { refetch } = usePayables();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PayableFormData>({
    resolver: zodResolver(payableSchema),
    defaultValues: {
      due_date: new Date(),
      title: '',
      amount: '',
      category_id: '',
      is_paid: false,
      description: '',
    },
  });

  const onSubmit = async (data: PayableFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const amount = parseFloat(data.amount.replace(',', '.'));
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Valor deve ser um número positivo');
      }

      const { error } = await supabase
        .from('payables')
        .insert({
          user_id: user.id,
          title: data.title,
          amount,
          due_date: format(data.due_date, 'yyyy-MM-dd'),
          category_id: data.category_id || null,
          is_paid: data.is_paid,
          description: data.description || null,
        });

      if (error) throw error;

      await refetch();

      toast({
        title: 'Sucesso!',
        description: 'Conta a pagar adicionada com sucesso',
      });

      form.reset({
        due_date: new Date(),
        title: '',
        amount: '',
        category_id: '',
        is_paid: false,
        description: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar conta a pagar:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar conta a pagar',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Conta de luz, Aluguel..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="0,00" 
                    {...field}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      value = (parseFloat(value) / 100).toFixed(2).replace('.', ',');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria (opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_paid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Pago</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Marque se esta conta já foi paga
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione observações adicionais..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Adicionar Conta a Pagar'}
        </Button>
      </form>
    </Form>
  );
}
