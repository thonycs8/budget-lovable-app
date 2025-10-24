import { useState } from 'react';
import { Plus, TrendingDown, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DebtForm } from '@/components/forms/DebtForm';
import { DebtList } from '@/components/debt/DebtList';
import { DebtSimulator } from '@/components/debt/DebtSimulator';
import { useDebts } from '@/hooks/useDebts';
import { useCurrency } from '@/hooks/useCurrency';

export default function Debts() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const { debts, loading } = useDebts();
  const { formatCurrency } = useCurrency();

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remaining_amount, 0);
  const totalPaid = debts.reduce((sum, debt) => sum + (debt.total_amount - debt.remaining_amount), 0);
  const monthlyPayments = debts.reduce((sum, debt) => sum + debt.monthly_payment, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestão de Dívidas</h1>
          <p className="text-muted-foreground mt-1">Acompanhe e planeje o pagamento das suas dívidas</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Simular
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Simulador de Pagamento</DialogTitle>
                <DialogDescription>
                  Simule diferentes estratégias para quitar suas dívidas mais rápido
                </DialogDescription>
              </DialogHeader>
              <DebtSimulator debts={debts} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Dívida
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Dívida</DialogTitle>
                <DialogDescription>
                  Cadastre uma dívida para acompanhar seu pagamento
                </DialogDescription>
              </DialogHeader>
              <DebtForm onSuccess={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Dívida</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {debts.filter(d => d.remaining_amount > 0).length} dívida(s) ativa(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Já Pago</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalDebt > 0 ? `${((totalPaid / (totalDebt + totalPaid)) * 100).toFixed(1)}%` : '100%'} do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parcela Mensal</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyPayments)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Comprometimento mensal
            </p>
          </CardContent>
        </Card>
      </div>

      <DebtList debts={debts} loading={loading} />
    </div>
  );
}
