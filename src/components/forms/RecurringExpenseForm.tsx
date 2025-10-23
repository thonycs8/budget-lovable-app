import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCategories } from '@/hooks/useCategories';
import { useRecurringExpenses } from '@/hooks/useRecurringExpenses';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecurringExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RecurringExpenseForm({ onSuccess, onCancel }: RecurringExpenseFormProps) {
  const { categories } = useCategories();
  const { createRecurringExpense } = useRecurringExpenses();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category_id: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly',
    start_date: new Date(),
    end_date: null as Date | null,
    reminder_days_before: 3,
    auto_create: false,
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createRecurringExpense({
      ...formData,
      amount: Number(formData.amount),
      start_date: formData.start_date.toISOString().split('T')[0],
      end_date: formData.end_date?.toISOString().split('T')[0] || null,
    });
    
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Aluguel"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) => setFormData({ ...formData, category_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="frequency">Frequência *</Label>
        <Select
          value={formData.frequency}
          onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diária</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="biweekly">Quinzenal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Início *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.start_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date ? format(formData.start_date, "PPP") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.start_date}
                onSelect={(date) => setFormData({ ...formData, start_date: date || new Date() })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Data de Fim (Opcional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.end_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.end_date ? format(formData.end_date, "PPP") : "Indefinido"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.end_date || undefined}
                onSelect={(date) => setFormData({ ...formData, end_date: date || null })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reminder_days">Lembrar com quantos dias de antecedência?</Label>
        <Input
          id="reminder_days"
          type="number"
          min="0"
          max="30"
          value={formData.reminder_days_before}
          onChange={(e) => setFormData({ ...formData, reminder_days_before: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detalhes adicionais..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto_create"
          checked={formData.auto_create}
          onCheckedChange={(checked) => setFormData({ ...formData, auto_create: checked })}
        />
        <Label htmlFor="auto_create" className="cursor-pointer">
          Criar despesas automaticamente
        </Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Criar Despesa Recorrente
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
