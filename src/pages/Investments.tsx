
import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { useInvestments } from '@/hooks/useInvestments';
import InvestmentForm from '@/components/forms/InvestmentForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { format, parseISO } from 'date-fns';

export default function Investments() {
  const { investments, loading, deleteInvestment } = useInvestments();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getInvestmentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      stocks: 'Ações',
      funds: 'Fundos',
      crypto: 'Criptomoedas',
      'real-estate': 'Fundos Imobiliários',
      bonds: 'Renda Fixa',
      'fixed-income': 'Renda Fixa',
      'variable-income': 'Renda Variável'
    };
    return types[type] || type;
  };

  const getInvestmentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      stocks: 'bg-blue-100 text-blue-800 border-blue-200',
      funds: 'bg-purple-100 text-purple-800 border-purple-200',
      crypto: 'bg-orange-100 text-orange-800 border-orange-200',
      'real-estate': 'bg-green-100 text-green-800 border-green-200',
      bonds: 'bg-gray-100 text-gray-800 border-gray-200',
      'fixed-income': 'bg-gray-100 text-gray-800 border-gray-200',
      'variable-income': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Calculate portfolio statistics
  const portfolioStats = {
    totalInvested: investments.reduce((sum, inv) => sum + Number(inv.amount), 0),
    currentValue: investments.reduce((sum, inv) => sum + Number(inv.current_value || inv.amount), 0),
    get totalReturn() {
      return this.currentValue - this.totalInvested;
    },
    get returnPercentage() {
      return this.totalInvested > 0 ? (this.totalReturn / this.totalInvested) * 100 : 0;
    }
  };

  // Calculate portfolio distribution by type
  const distributionByType = investments.reduce((acc, investment) => {
    const type = investment.investment_type;
    if (!acc[type]) {
      acc[type] = { value: 0, percentage: 0 };
    }
    acc[type].value += Number(investment.current_value || investment.amount);
    return acc;
  }, {} as Record<string, { value: number; percentage: number }>);

  // Calculate percentages
  Object.keys(distributionByType).forEach(type => {
    distributionByType[type].percentage = portfolioStats.currentValue > 0 
      ? (distributionByType[type].value / portfolioStats.currentValue) * 100 
      : 0;
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteInvestment(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando investimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Investimentos</h1>
          <p className="text-muted-foreground">
            Acompanhe seu portfólio de investimentos
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Investimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Investimento</DialogTitle>
            </DialogHeader>
            <InvestmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Investido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioStats.totalInvested)}</div>
            <p className="text-xs text-muted-foreground">
              Capital inicial aplicado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Atual</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(portfolioStats.currentValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor de mercado atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retorno</CardTitle>
            {portfolioStats.totalReturn >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolioStats.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(portfolioStats.totalReturn)}
            </div>
            <p className="text-xs text-muted-foreground">
              Lucro/Prejuízo total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rentabilidade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolioStats.returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {portfolioStats.returnPercentage > 0 ? '+' : ''}{portfolioStats.returnPercentage.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Retorno percentual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Distribution */}
      {Object.keys(distributionByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição do Portfólio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(distributionByType).map(([type, data]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className={getInvestmentTypeColor(type)}>
                        {getInvestmentTypeLabel(type)}
                      </Badge>
                      <span className="font-medium">{formatCurrency(data.value)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {data.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={data.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Investments List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seus Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum investimento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando seu primeiro investimento.
              </p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Investimento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Investimento</DialogTitle>
                  </DialogHeader>
                  <InvestmentForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {investments.map((investment) => {
                const currentValue = Number(investment.current_value || investment.amount);
                const investedAmount = Number(investment.amount);
                const returnAmount = currentValue - investedAmount;
                const returnPercentage = investedAmount > 0 ? (returnAmount / investedAmount) * 100 : 0;
                const isPositive = returnPercentage >= 0;
                
                return (
                  <div
                    key={investment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{investment.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge className={getInvestmentTypeColor(investment.investment_type)}>
                              {getInvestmentTypeLabel(investment.investment_type)}
                            </Badge>
                            <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
                              {isPositive ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {isPositive ? '+' : ''}{returnPercentage.toFixed(2)}%
                            </Badge>
                          </div>
                          {investment.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {investment.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right sm:hidden">
                          <div className="text-lg font-semibold">
                            {formatCurrency(currentValue)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Investido: {formatCurrency(investedAmount)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
                        <div>Data da compra: {format(parseISO(investment.purchase_date), 'dd/MM/yyyy')}</div>
                        <div className={`font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          Retorno: {formatCurrency(returnAmount)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {formatCurrency(currentValue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Investido: {formatCurrency(investedAmount)}
                        </div>
                        <div className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(returnAmount)}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o investimento "{investment.title}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(investment.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
