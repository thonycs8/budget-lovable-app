import { DollarSign, TrendingUp, TrendingDown, PiggyBank, AlertTriangle, Target, Wallet } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { BalancePrediction } from '@/components/dashboard/BalancePrediction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';
import { usePayables } from '@/hooks/usePayables';
import { useInvestments } from '@/hooks/useInvestments';
import { useDebts } from '@/hooks/useDebts';
import { useCategories } from '@/hooks/useCategories';
import { useCurrency } from '@/hooks/useCurrency';

export function Dashboard() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { payables, loading: payablesLoading } = usePayables();
  const { investments, loading: investmentsLoading } = useInvestments();
  const { debts, loading: debtsLoading } = useDebts();
  const { categories } = useCategories();
  const { formatCurrency } = useCurrency();

  if (incomeLoading || expensesLoading || payablesLoading || investmentsLoading || debtsLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded-lg" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingPayables = payables.filter(p => !p.is_paid).reduce((sum, p) => sum + Number(p.amount), 0);

  // Calculate investment totals
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + Number(inv.current_value || inv.amount), 0);
  const investmentGain = totalCurrentValue - totalInvested;

  // Calculate debt totals
  const totalDebt = debts.reduce((sum, debt) => sum + debt.remaining_amount, 0);
  const totalPaidDebt = debts.reduce((sum, debt) => sum + (debt.total_amount - debt.remaining_amount), 0);
  const monthlyDebtPayments = debts.filter(d => d.status === 'active').reduce((sum, debt) => sum + debt.monthly_payment, 0);
  const activeDebts = debts.filter(d => d.remaining_amount > 0);

  // Calculate expense data for chart
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = categories.find(cat => cat.id === expense.category_id);
    const categoryName = category?.name || 'Sem categoria';
    const existing = acc.find(item => item.name === categoryName);
    if (existing) {
      existing.value += Number(expense.amount);
    } else {
      acc.push({
        name: categoryName,
        value: Number(expense.amount),
        color: category?.color || '#ef4444'
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  // Calculate income data for chart
  const incomesByCategory = income.reduce((acc, incomeItem) => {
    const category = categories.find(cat => cat.id === incomeItem.category_id);
    const categoryName = category?.name || 'Sem categoria';
    const existing = acc.find(item => item.name === categoryName);
    if (existing) {
      existing.value += Number(incomeItem.amount);
    } else {
      acc.push({
        name: categoryName,
        value: Number(incomeItem.amount),
        color: category?.color || '#22c55e'
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  // Calculate overdue payables
  const overduePayables = payables.filter(p => {
    const dueDate = new Date(p.due_date);
    const today = new Date();
    return !p.is_paid && dueDate < today;
  });

  // Recent transactions - combine income and expenses
  const allTransactions = [
    ...income.map(item => ({ ...item, type: 'income' as const })),
    ...expenses.map(item => ({ ...item, type: 'expense' as const }))
  ];
  
  const recentTransactions = allTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between animate-in slide-in-from-top duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral das suas finanças pessoais
          </p>
        </div>
      </div>

      {/* Alerts */}
      {overduePayables.length > 0 && (
        <Card className="border-destructive bg-destructive/5 animate-in slide-in-from-top duration-500 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
              Contas em Atraso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Você tem <span className="font-semibold text-destructive">{overduePayables.length}</span> conta(s) em atraso no valor de <span className="font-semibold text-destructive">{formatCurrency(overduePayables.reduce((sum, p) => sum + Number(p.amount), 0))}</span>
            </p>
            <Button variant="destructive" size="sm" className="hover-scale">
              Ver Contas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 animate-in fade-in duration-700 delay-150">
        <MetricCard
          title="Total de Receitas"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="h-4 w-4" />}
          variant="income"
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="Total de Despesas"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="h-4 w-4" />}
          variant="expense"
          trend={{ value: -8.2, isPositive: false }}
        />
        <MetricCard
          title="Lucro Líquido"
          value={formatCurrency(netProfit)}
          icon={<DollarSign className="h-4 w-4" />}
          variant={netProfit >= 0 ? 'income' : 'expense'}
          trend={{ value: 15.3, isPositive: netProfit >= 0 }}
        />
        <MetricCard
          title="Dívidas Ativas"
          value={formatCurrency(totalDebt)}
          icon={<Wallet className="h-4 w-4" />}
          variant="expense"
        />
        <MetricCard
          title="Contas a Pagar"
          value={formatCurrency(pendingPayables)}
          icon={<PiggyBank className="h-4 w-4" />}
          variant="investment"
        />
        <MetricCard
          title="Investimentos"
          value={formatCurrency(totalCurrentValue)}
          icon={<Target className="h-4 w-4" />}
          variant={investmentGain >= 0 ? 'income' : 'expense'}
          trend={{ 
            value: totalInvested > 0 ? (investmentGain / totalInvested) * 100 : 0, 
            isPositive: investmentGain >= 0 
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 animate-in fade-in duration-700 delay-300">
        <CategoryChart
          data={expensesByCategory}
          title="Despesas por Categoria"
          total={totalExpenses}
          formatCurrency={formatCurrency}
        />
        <CategoryChart
          data={incomesByCategory}
          title="Receitas por Categoria"
          total={totalIncome}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Debt, Investment and Payables Summary */}
      <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-700 delay-450">
        {/* Debt Summary */}
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Wallet className="h-5 w-5 text-destructive" />
              </div>
              Resumo de Dívidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {debts.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-destructive/5 to-transparent">
                    <p className="text-sm text-muted-foreground mb-1">Total em Dívida</p>
                    <p className="text-xl font-bold text-destructive">{formatCurrency(totalDebt)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-income/5 to-transparent">
                    <p className="text-sm text-muted-foreground mb-1">Já Pago</p>
                    <p className="text-xl font-bold text-income">{formatCurrency(totalPaidDebt)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm text-muted-foreground">Parcela Mensal</span>
                    <span className="font-semibold text-warning">
                      {formatCurrency(monthlyDebtPayments)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm text-muted-foreground">Dívidas Ativas</span>
                    <span className="font-semibold">
                      {activeDebts.length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-3">Maiores Dívidas:</p>
                  {activeDebts
                    .sort((a, b) => b.remaining_amount - a.remaining_amount)
                    .slice(0, 3)
                    .map((debt, idx) => (
                      <div 
                        key={debt.id} 
                        className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:translate-x-1"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <span className="truncate flex-1">{debt.name}</span>
                        <span className="font-medium text-destructive ml-2">{formatCurrency(debt.remaining_amount)}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma dívida</h3>
                <p className="text-muted-foreground mb-4">
                  Você está livre de dívidas!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Investment Summary */}
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-investment">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-investment/10">
                <Target className="h-5 w-5 text-investment" />
              </div>
              Resumo de Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investments.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-investment/5 to-transparent">
                    <p className="text-sm text-muted-foreground mb-1">Total Investido</p>
                    <p className="text-xl font-bold text-investment">{formatCurrency(totalInvested)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-investment/5 to-transparent">
                    <p className="text-sm text-muted-foreground mb-1">Valor Atual</p>
                    <p className="text-xl font-bold text-investment">{formatCurrency(totalCurrentValue)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm text-muted-foreground">Ganho/Perda</span>
                    <span className={`font-semibold ${investmentGain >= 0 ? 'text-income' : 'text-expense'}`}>
                      {investmentGain >= 0 ? '+' : ''}{formatCurrency(investmentGain)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-sm text-muted-foreground">Rentabilidade</span>
                    <span className={`font-semibold ${investmentGain >= 0 ? 'text-income' : 'text-expense'}`}>
                      {totalInvested > 0 ? ((investmentGain / totalInvested) * 100).toFixed(2) : '0.00'}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-3">Top Investimentos:</p>
                  {investments.slice(0, 3).map((investment, idx) => (
                    <div 
                      key={investment.id} 
                      className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:translate-x-1"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="truncate flex-1">{investment.title}</span>
                      <span className="font-medium text-investment ml-2">{formatCurrency(Number(investment.current_value || investment.amount))}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum investimento</h3>
                <p className="text-muted-foreground mb-4">
                  Comece a investir para acompanhar seu patrimônio
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payables Summary */}
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              Resumo de Contas a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payables.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-warning/5 to-transparent">
                    <p className="text-sm text-muted-foreground mb-1">Total Pendente</p>
                    <p className="text-xl font-bold text-warning">{formatCurrency(pendingPayables)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-warning/5 to-transparent">
                    <p className="text-sm text-muted-foreground mb-1">Contas Pendentes</p>
                    <p className="text-xl font-bold text-warning">{payables.filter(p => !p.is_paid).length}</p>
                  </div>
                </div>
                {overduePayables.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-destructive/5 transition-colors">
                      <span className="text-sm text-muted-foreground">Em Atraso</span>
                      <span className="font-semibold text-destructive">
                        {overduePayables.length} conta(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1 p-2 rounded-lg hover:bg-destructive/5 transition-colors">
                      <span className="text-sm text-muted-foreground">Valor em Atraso</span>
                      <span className="font-semibold text-destructive">
                        {formatCurrency(overduePayables.reduce((sum, p) => sum + Number(p.amount), 0))}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-3">Próximos Vencimentos:</p>
                  {payables
                    .filter(p => !p.is_paid)
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 3)
                    .map((payable, idx) => (
                      <div 
                        key={payable.id} 
                        className="flex justify-between items-start text-sm p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 hover:translate-x-1"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex-1">
                          <span className="truncate block font-medium">{payable.title}</span>
                          <span className="text-xs text-muted-foreground">{new Date(payable.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className="font-medium text-warning ml-2">{formatCurrency(Number(payable.amount))}</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <PiggyBank className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma conta a pagar</h3>
                <p className="text-muted-foreground mb-4">
                  Todas as contas estão em dia!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Balance Prediction Section - Temporarily Disabled */}
      {/* <BalancePrediction /> */}

      {/* Recent Transactions */}
      <Card className="animate-in fade-in duration-700 delay-500 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((transaction, idx) => {
                const category = categories.find(cat => cat.id === transaction.category_id);
                return (
                  <div
                    key={transaction.id}
                    className="group flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-primary/20"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'income' ? 'bg-income' : 'bg-expense'
                      } shadow-lg animate-pulse`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-primary transition-colors">{transaction.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="truncate">{category?.name || 'Sem categoria'}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${
                          transaction.type === 'income' 
                            ? 'border-income/30 text-income' 
                            : 'border-expense/30 text-expense'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;