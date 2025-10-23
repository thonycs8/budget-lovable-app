import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useIncome, Income } from '@/hooks/useIncome';
import { useCategories } from '@/hooks/useCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const incomeSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 999999999.99;
  }, 'Valor deve ser positivo e menor que 1 bilhão'),
  category_id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeFormProps {
  isOpen: boolean;
  onClose: () => void;
  income?: Income;
}

export default function IncomeForm({ isOpen, onClose, income }: IncomeFormProps) {
  const { createIncome, updateIncome } = useIncome();
  const { categories, loading: categoriesLoading } = useCategories();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      title: '',
      amount: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    }
  });

  useEffect(() => {
    if (income) {
      reset({
        title: income.title,
        amount: income.amount.toString(),
        category_id: income.category_id || '',
        date: income.date,
        description: income.description || '',
      });
    } else if (isOpen) {
      reset({
        title: '',
        amount: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  }, [income, reset, isOpen]);

  const onSubmit = async (data: IncomeFormData) => {
    setLoading(true);

    try {
      const incomeData = {
        title: data.title.trim(),
        amount: parseFloat(data.amount),
        category_id: data.category_id === "none" || !data.category_id ? null : data.category_id,
        date: data.date,
        description: data.description?.trim() || '',
      };

      if (income) {
        await updateIncome(income.id, incomeData);
      } else {
        await createIncome(incomeData);
      }

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar receita",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryId = watch('category_id');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {income ? 'Editar Receita' : 'Nova Receita'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: Salário, Freelance..."
              maxLength={200}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              placeholder="0,00"
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={categoryId || ''} 
              onValueChange={(value) => setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição opcional..."
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : (income ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}