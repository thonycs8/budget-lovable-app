import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useInvestments, Investment } from '@/hooks/useInvestments';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const investmentTypes = [
  'Ações',
  'Fundos Imobiliários',
  'Tesouro Direto',
  'CDB',
  'LCI/LCA',
  'Debêntures',
  'Fundos de Investimento',
  'Criptomoedas',
  'Outros'
];

const investmentSchema = z.object({
  title: z.string().trim().min(1, 'Título é obrigatório').max(200, 'Título deve ter no máximo 200 caracteres'),
  amount: z.string().min(1, 'Valor é obrigatório').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0 && num <= 999999999.99;
  }, 'Valor deve ser positivo e menor que 1 bilhão'),
  current_value: z.string().optional().refine((val) => {
    if (!val || val === '') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 999999999.99;
  }, 'Valor atual deve ser positivo e menor que 1 bilhão'),
  investment_type: z.string().min(1, 'Tipo de investimento é obrigatório'),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional(),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  investment?: Investment;
}

export default function InvestmentForm({ isOpen, onClose, investment }: InvestmentFormProps) {
  const { createInvestment, updateInvestment } = useInvestments();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      title: '',
      amount: '',
      current_value: '',
      investment_type: '',
      purchase_date: new Date().toISOString().split('T')[0],
      description: '',
    }
  });

  useEffect(() => {
    if (investment) {
      reset({
        title: investment.title,
        amount: investment.amount.toString(),
        current_value: investment.current_value?.toString() || '',
        investment_type: investment.investment_type,
        purchase_date: investment.purchase_date,
        description: investment.description || '',
      });
    } else if (isOpen) {
      reset({
        title: '',
        amount: '',
        current_value: '',
        investment_type: '',
        purchase_date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
  }, [investment, reset, isOpen]);

  const onSubmit = async (data: InvestmentFormData) => {
    setLoading(true);

    try {
      const investmentData = {
        title: data.title.trim(),
        amount: parseFloat(data.amount),
        current_value: data.current_value ? parseFloat(data.current_value) : null,
        investment_type: data.investment_type,
        purchase_date: data.purchase_date,
        description: data.description?.trim() || '',
      };

      if (investment) {
        await updateInvestment(investment.id, investmentData);
      } else {
        await createInvestment(investmentData);
      }

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar investimento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const investmentType = watch('investment_type');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {investment ? 'Editar Investimento' : 'Novo Investimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ex: PETR4, Tesouro SELIC..."
              maxLength={200}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Investido</Label>
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
              <Label htmlFor="current_value">Valor Atual</Label>
              <Input
                id="current_value"
                type="number"
                step="0.01"
                {...register('current_value')}
                placeholder="0,00"
              />
              {errors.current_value && (
                <p className="text-sm text-destructive">{errors.current_value.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment_type">Tipo de Investimento</Label>
            <Select 
              value={investmentType} 
              onValueChange={(value) => setValue('investment_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.investment_type && (
              <p className="text-sm text-destructive">{errors.investment_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_date">Data da Compra</Label>
            <Input
              id="purchase_date"
              type="date"
              {...register('purchase_date')}
            />
            {errors.purchase_date && (
              <p className="text-sm text-destructive">{errors.purchase_date.message}</p>
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
              {loading ? 'Salvando...' : (investment ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}