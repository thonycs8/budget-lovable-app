import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecurringExpenseForm } from '@/components/forms/RecurringExpenseForm';
import { Plus, Construction } from 'lucide-react';
import { useState } from 'react';

export default function Calendar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendário Financeiro Preditivo</h1>
          <p className="text-muted-foreground mt-1">
            Visualize gastos confirmados e previsões inteligentes
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover-scale">
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa Recorrente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Despesa Recorrente</DialogTitle>
            </DialogHeader>
            <RecurringExpenseForm 
              onSuccess={() => setOpen(false)}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5 text-warning" />
            Calendário em Manutenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O calendário preditivo está temporariamente desabilitado enquanto corrigimos alguns problemas técnicos.
            Por favor, volte mais tarde.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
