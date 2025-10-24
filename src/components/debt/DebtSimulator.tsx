import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrency } from '@/hooks/useCurrency';
import { Debt } from '@/hooks/useDebts';

interface DebtSimulatorProps {
  debts: Debt[];
}

export function DebtSimulator({ debts }: DebtSimulatorProps) {
  const { formatCurrency } = useCurrency();
  const [extraPayment, setExtraPayment] = useState('');
  
  const activeDebts = debts.filter(d => d.status === 'active');
  const totalDebt = activeDebts.reduce((sum, d) => sum + d.remaining_amount, 0);
  const totalMonthly = activeDebts.reduce((sum, d) => sum + d.monthly_payment, 0);

  const calculatePayoffTime = (debt: Debt, extra: number = 0) => {
    const monthlyPayment = debt.monthly_payment + extra;
    const monthlyRate = debt.interest_rate / 100;
    
    if (monthlyRate === 0) {
      return Math.ceil(debt.remaining_amount / monthlyPayment);
    }
    
    const months = Math.log(monthlyPayment / (monthlyPayment - debt.remaining_amount * monthlyRate)) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  };

  const calculateTotalInterest = (debt: Debt, extra: number = 0) => {
    const months = calculatePayoffTime(debt, extra);
    const totalPaid = (debt.monthly_payment + extra) * months;
    return totalPaid - debt.remaining_amount;
  };

  const snowballMethod = () => {
    // Método Bola de Neve: pagar primeiro as menores dívidas
    return [...activeDebts].sort((a, b) => a.remaining_amount - b.remaining_amount);
  };

  const avalancheMethod = () => {
    // Método Avalanche: pagar primeiro as dívidas com maior juros
    return [...activeDebts].sort((a, b) => b.interest_rate - a.interest_rate);
  };

  const extra = parseFloat(extraPayment) || 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Simulação com Pagamento Extra</CardTitle>
          <CardDescription>Veja quanto tempo economiza pagando um valor extra por mês</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="extra-payment">Valor Extra Mensal</Label>
            <Input
              id="extra-payment"
              type="number"
              step="50"
              placeholder="Ex: 200"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Pagamento Atual</p>
              <p className="text-xl font-bold">{formatCurrency(totalMonthly)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Com Extra</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalMonthly + extra)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="snowball">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="snowball">Bola de Neve</TabsTrigger>
          <TabsTrigger value="avalanche">Avalanche</TabsTrigger>
        </TabsList>

        <TabsContent value="snowball" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Método Bola de Neve</CardTitle>
              <CardDescription>
                Pague primeiro as dívidas menores para ganhar motivação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {snowballMethod().map((debt, index) => {
                const monthsNormal = calculatePayoffTime(debt);
                const monthsWithExtra = calculatePayoffTime(debt, extra);
                const savedMonths = monthsNormal - monthsWithExtra;

                return (
                  <div key={debt.id} className="border-l-4 border-primary pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{index + 1}. {debt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(debt.remaining_amount)}
                        </p>
                      </div>
                      <Badge variant="outline">{debt.interest_rate}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sem extra</p>
                        <p className="font-semibold">{monthsNormal} meses</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Com extra</p>
                        <p className="font-semibold text-success">
                          {monthsWithExtra} meses
                          {savedMonths > 0 && <span className="text-xs ml-1">(-{savedMonths})</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avalanche" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Método Avalanche</CardTitle>
              <CardDescription>
                Pague primeiro as dívidas com juros mais altos para economizar mais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {avalancheMethod().map((debt, index) => {
                const monthsNormal = calculatePayoffTime(debt);
                const monthsWithExtra = calculatePayoffTime(debt, extra);
                const savedMonths = monthsNormal - monthsWithExtra;
                const interestNormal = calculateTotalInterest(debt);
                const interestWithExtra = calculateTotalInterest(debt, extra);
                const savedInterest = interestNormal - interestWithExtra;

                return (
                  <div key={debt.id} className="border-l-4 border-success pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{index + 1}. {debt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(debt.remaining_amount)}
                        </p>
                      </div>
                      <Badge variant="destructive">{debt.interest_rate}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sem extra</p>
                        <p className="font-semibold">{monthsNormal} meses</p>
                        <p className="text-xs text-muted-foreground">
                          Juros: {formatCurrency(interestNormal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Com extra</p>
                        <p className="font-semibold text-success">
                          {monthsWithExtra} meses
                          {savedMonths > 0 && <span className="text-xs ml-1">(-{savedMonths})</span>}
                        </p>
                        <p className="text-xs text-success">
                          Economiza: {formatCurrency(savedInterest)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'outline' | 'destructive' | 'success' }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-input bg-background',
    destructive: 'bg-destructive text-destructive-foreground',
    success: 'bg-success text-success-foreground',
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};
