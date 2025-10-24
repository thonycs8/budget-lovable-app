import { useState } from 'react';
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebts, Debt } from '@/hooks/useDebts';
import { useCurrency } from '@/hooks/useCurrency';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DebtListProps {
  debts: Debt[];
  loading: boolean;
}

const categoryLabels = {
  personal_loan: 'Empréstimo Pessoal',
  mortgage: 'Crédito Habitação',
  car_loan: 'Financiamento Auto',
  credit_card: 'Cartão de Crédito',
  other: 'Outro',
};

const statusLabels = {
  active: { label: 'Ativa', variant: 'default' as const },
  paid: { label: 'Paga', variant: 'secondary' as const },
  overdue: { label: 'Atrasada', variant: 'destructive' as const },
};

export function DebtList({ debts, loading }: DebtListProps) {
  const { deleteDebt, registerPayment } = useDebts();
  const { formatCurrency } = useCurrency();
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; debt?: Debt }>({ open: false });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; debtId?: string }>({ open: false });

  const handlePayment = async () => {
    if (paymentDialog.debt && paymentAmount) {
      await registerPayment(paymentDialog.debt.id, parseFloat(paymentAmount));
      setPaymentDialog({ open: false });
      setPaymentAmount('');
    }
  };

  const handleDelete = async () => {
    if (deleteDialog.debtId) {
      await deleteDebt(deleteDialog.debtId);
      setDeleteDialog({ open: false });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando dívidas...</div>;
  }

  if (debts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            Nenhuma dívida cadastrada. Comece adicionando sua primeira dívida.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {debts.map((debt) => {
          const progress = ((debt.total_amount - debt.remaining_amount) / debt.total_amount) * 100;
          const statusInfo = statusLabels[debt.status];

          return (
            <Card key={debt.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{debt.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {categoryLabels[debt.category]}
                    </CardDescription>
                  </div>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Valor Total</p>
                    <p className="font-semibold">{formatCurrency(debt.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Saldo Devedor</p>
                    <p className="font-semibold text-destructive">
                      {formatCurrency(debt.remaining_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Parcela Mensal</p>
                    <p className="font-semibold">{formatCurrency(debt.monthly_payment)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Taxa de Juros</p>
                    <p className="font-semibold">{debt.interest_rate}% a.m.</p>
                  </div>
                </div>

                {debt.description && (
                  <p className="text-sm text-muted-foreground">{debt.description}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPaymentDialog({ open: true, debt })}
                    disabled={debt.status === 'paid'}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Registrar Pagamento
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog({ open: true, debtId: debt.id })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
            <DialogDescription>
              {paymentDialog.debt?.name} - Saldo: {formatCurrency(paymentDialog.debt?.remaining_amount || 0)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Valor do Pagamento</Label>
              <Input
                id="payment-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPaymentDialog({ open: false })}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handlePayment}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A dívida será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
