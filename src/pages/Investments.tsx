import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface Investment {
  id: string;
  name: string;
  type: 'stocks' | 'funds' | 'crypto' | 'real-estate' | 'bonds';
  amount: number;
  currentValue: number;
  percentage: number;
  lastUpdate: string;
}

interface Portfolio {
  totalInvested: number;
  currentValue: number;
  totalReturn: number;
  returnPercentage: number;
  investments: Investment[];
}

export default function Investments() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Mock investment data
  const portfolio: Portfolio = {
    totalInvested: 50000,
    currentValue: 62500,
    totalReturn: 12500,
    returnPercentage: 25,
    investments: [
      {
        id: '1',
        name: 'Tesouro Selic 2027',
        type: 'bonds',
        amount: 15000,
        currentValue: 16200,
        percentage: 8,
        lastUpdate: '2025-01-17'
      },
      {
        id: '2',
        name: 'PETR4',
        type: 'stocks',
        amount: 8000,
        currentValue: 9500,
        percentage: 18.75,
        lastUpdate: '2025-01-17'
      },
      {
        id: '3',
        name: 'ITSA4',
        type: 'stocks',
        amount: 5000,
        currentValue: 5800,
        percentage: 16,
        lastUpdate: '2025-01-17'
      },
      {
        id: '4',
        name: 'XP Fundos Imobiliários',
        type: 'real-estate',
        amount: 12000,
        currentValue: 14000,
        percentage: 16.67,
        lastUpdate: '2025-01-17'
      },
      {
        id: '5',
        name: 'Bitcoin (BTC)',
        type: 'crypto',
        amount: 7000,
        currentValue: 12000,
        percentage: 71.43,
        lastUpdate: '2025-01-17'
      },
      {
        id: '6',
        name: 'Fundo Multimercado',
        type: 'funds',
        amount: 3000,
        currentValue: 5000,
        percentage: 66.67,
        lastUpdate: '2025-01-17'
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getInvestmentTypeLabel = (type: Investment['type']) => {
    const types = {
      stocks: 'Ações',
      funds: 'Fundos',
      crypto: 'Criptomoedas',
      'real-estate': 'Fundos Imobiliários',
      bonds: 'Renda Fixa'
    };
    return types[type];
  };

  const getInvestmentTypeColor = (type: Investment['type']) => {
    const colors = {
      stocks: 'bg-blue-100 text-blue-800 border-blue-200',
      funds: 'bg-purple-100 text-purple-800 border-purple-200',
      crypto: 'bg-orange-100 text-orange-800 border-orange-200',
      'real-estate': 'bg-green-100 text-green-800 border-green-200',
      bonds: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type];
  };

  // Calculate portfolio distribution
  const distributionByType = portfolio.investments.reduce((acc, investment) => {
    const type = investment.type;
    if (!acc[type]) {
      acc[type] = { value: 0, percentage: 0 };
    }
    acc[type].value += investment.currentValue;
    return acc;
  }, {} as Record<string, { value: number; percentage: number }>);

  // Calculate percentages
  Object.keys(distributionByType).forEach(type => {
    distributionByType[type].percentage = (distributionByType[type].value / portfolio.currentValue) * 100;
  });

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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Investimento</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Funcionalidade em desenvolvimento</h3>
              <p className="text-muted-foreground">
                Em breve você poderá adicionar e gerenciar seus investimentos
              </p>
            </div>
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
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalInvested)}</div>
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
              {formatCurrency(portfolio.currentValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor de mercado atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retorno</CardTitle>
            {portfolio.totalReturn >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolio.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(portfolio.totalReturn)}
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
            <div className={`text-2xl font-bold ${portfolio.returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {portfolio.returnPercentage > 0 ? '+' : ''}{portfolio.returnPercentage.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Retorno percentual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Distribution */}
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
                    <Badge className={getInvestmentTypeColor(type as Investment['type'])}>
                      {getInvestmentTypeLabel(type as Investment['type'])}
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

      {/* Investments List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seus Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.investments.map((investment) => {
              const isPositive = investment.percentage >= 0;
              
              return (
                <div
                  key={investment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{investment.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge className={getInvestmentTypeColor(investment.type)}>
                            {getInvestmentTypeLabel(investment.type)}
                          </Badge>
                          <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center gap-1">
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {isPositive ? '+' : ''}{investment.percentage.toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right sm:hidden">
                        <div className="text-lg font-semibold">
                          {formatCurrency(investment.currentValue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Investido: {formatCurrency(investment.amount)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Retorno: {formatCurrency(investment.currentValue - investment.amount)}
                    </div>
                  </div>
                  
                  <div className="hidden sm:block text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(investment.currentValue)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Investido: {formatCurrency(investment.amount)}
                    </div>
                    <div className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {formatCurrency(investment.currentValue - investment.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Melhores Performances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {portfolio.investments
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 3)
                .map((investment, index) => (
                  <div key={investment.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{investment.name}</span>
                    </div>
                    <span className="text-emerald-600 font-medium">
                      +{investment.percentage.toFixed(2)}%
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Renda Variável</span>
                <span className="font-medium">
                  {formatCurrency(
                    distributionByType.stocks?.value + distributionByType.crypto?.value || 0
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Renda Fixa</span>
                <span className="font-medium">
                  {formatCurrency(distributionByType.bonds?.value || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fundos</span>
                <span className="font-medium">
                  {formatCurrency(
                    distributionByType.funds?.value + distributionByType['real-estate']?.value || 0
                  )}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(portfolio.currentValue)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}