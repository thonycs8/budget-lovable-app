import { DollarSign, TrendingUp, TrendingDown, PiggyBank, AlertTriangle, Target } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';
import { usePayables } from '@/hooks/usePayables';
import { useInvestments } from '@/hooks/useInvestments';
import { useCategories } from '@/hooks/useCategories';
import { useCurrency } from '@/hooks/useCurrency';

export function Dashboard() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { payables, loading: payablesLoading } = usePayables();
  const { investments, loading: investmentsLoading } = useInvestments();
  const { categories } = useCategories();
  const { formatCurrency } = useCurrency();

  if (incomeLoading || expensesLoading || payablesLoading || investmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dashboard...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças pessoais
          </p>
        </div>
      </div>

      {/* Alerts */}
      {overduePayables.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Contas em Atraso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Você tem {overduePayables.length} conta(s) em atraso no valor de {formatCurrency(overduePayables.reduce((sum, p) => sum + Number(p.amount), 0))}
            </p>
            <Button variant="destructive" size="sm">
              Ver Contas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
      <div className="grid gap-6 md:grid-cols-2">
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

      {/* Investment and Payables Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Investment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Resumo de Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {investments.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investido</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(totalInvested)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Atual</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(totalCurrentValue)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ganho/Perda</span>
                    <span className={`font-semibold ${investmentGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investmentGain >= 0 ? '+' : ''}{formatCurrency(investmentGain)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">Rentabilidade</span>
                    <span className={`font-semibold ${investmentGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalInvested > 0 ? ((investmentGain / totalInvested) * 100).toFixed(2) : '0.00'}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Top Investimentos:</p>
                  {investments.slice(0, 3).map((investment) => (
                    <div key={investment.id} className="flex justify-between text-sm">
                      <span className="truncate">{investment.title}</span>
                      <span className="font-medium">{formatCurrency(Number(investment.current_value || investment.amount))}</span>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Resumo de Contas a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payables.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pendente</p>
                    <p className="text-xl font-bold text-orange-600">{formatCurrency(pendingPayables)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contas Pendentes</p>
                    <p className="text-xl font-bold text-orange-600">{payables.filter(p => !p.is_paid).length}</p>
                  </div>
                </div>
                {overduePayables.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Em Atraso</span>
                      <span className="font-semibold text-red-600">
                        {overduePayables.length} conta(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Valor em Atraso</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(overduePayables.reduce((sum, p) => sum + Number(p.amount), 0))}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Próximos Vencimentos:</p>
                  {payables
                    .filter(p => !p.is_paid)
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 3)
                    .map((payable) => (
                      <div key={payable.id} className="flex justify-between text-sm">
                        <div>
                          <span className="truncate block">{payable.title}</span>
                          <span className="text-muted-foreground">{new Date(payable.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(Number(payable.amount))}</span>
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const category = categories.find(cat => cat.id === transaction.category_id);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'income' ? 'bg-income' : 'bg-expense'
                      }`} />
                      <div>
                        <p className="font-medium">{transaction.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {category?.name || 'Sem categoria'} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                      </p>
                      <Badge variant="outline" className="text-xs">
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