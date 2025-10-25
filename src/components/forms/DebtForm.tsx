import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebts } from '@/hooks/useDebts';

const debtSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  total_amount: z.string().min(1, 'Valor total é obrigatório'),
  remaining_amount: z.string().min(1, 'Saldo devedor é obrigatório'),
  interest_rate: z.string().min(0, 'Taxa de juros inválida'),
  monthly_payment: z.string().min(1, 'Parcela mensal é obrigatória'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  category: z.enum(['personal_loan', 'mortgage', 'car_loan', 'credit_card', 'other']),
});

type DebtFormValues = z.infer<typeof debtSchema>;

const categoryLabels = {
  personal_loan: 'Empréstimo Pessoal',
  mortgage: 'Crédito Habitação',
  car_loan: 'Financiamento Auto',
  credit_card: 'Cartão de Crédito',
  other: 'Outro',
};

interface DebtFormProps {
  onSuccess?: () => void;
}

export function DebtForm({ onSuccess }: DebtFormProps) {
  const { createDebt } = useDebts();
  const [loading, setLoading] = useState(false);

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: '',
      description: '',
      total_amount: '',
      remaining_amount: '',
      interest_rate: '0',
      monthly_payment: '',
      start_date: new Date().toISOString().split('T')[0],
      category: 'other',
    },
  });

  const onSubmit = async (values: DebtFormValues) => {
    setLoading(true);
    try {
      const result = await createDebt({
        name: values.name,
        description: values.description,
        total_amount: parseFloat(values.total_amount),
        remaining_amount: parseFloat(values.remaining_amount),
        interest_rate: parseFloat(values.interest_rate),
        monthly_payment: parseFloat(values.monthly_payment),
        start_date: values.start_date,
        category: values.category,
        status: 'active',
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Dívida</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Empréstimo Banco XYZ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="total_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="15000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="remaining_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Saldo Devedor</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="15000.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthly_payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcela Mensal</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="350.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interest_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxa de Juros (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="2.5" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Taxa mensal</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Início</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalhes adicionais sobre esta dívida..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Salvando...' : 'Cadastrar Dívida'}
        </Button>
      </form>
    </Form>
  );
}
