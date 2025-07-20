import { DollarSign, TrendingUp, TrendingDown, PiggyBank, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';
import { usePayables } from '@/hooks/usePayables';
import { useCategories } from '@/hooks/useCategories';

export function Dashboard() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { payables, loading: payablesLoading } = usePayables();
  const { categories } = useCategories();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  if (incomeLoading || expensesLoading || payablesLoading) {
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
            Visão geral das suas finanças
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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