import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useBalancePrediction } from '@/hooks/useBalancePrediction';
import { useCurrency } from '@/hooks/useCurrency';
import { TrendingUp, TrendingDown, Activity, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BalancePrediction() {
  const { predictions, historicalData, modelStats, loading, generatePredictions } = useBalancePrediction();
  const { formatCurrency } = useCurrency();
  const [daysAhead, setDaysAhead] = useState(30);

  const handleGenerate = () => {
    generatePredictions(daysAhead);
  };

  // Combine historical and predicted data for the chart
  const chartData = [
    ...historicalData.map(d => ({
      date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      balance: d.balance,
      type: 'historical'
    })),
    ...predictions.map(p => ({
      date: new Date(p.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      predicted: p.predicted_balance,
      type: 'predicted'
    }))
  ];

  // Sample every N points for cleaner x-axis
  const sampledData = chartData.filter((_, index) => 
    index % Math.ceil(chartData.length / 15) === 0 || index === chartData.length - 1
  );

  const trend = modelStats ? (modelStats.slope > 0 ? 'up' : 'down') : 'neutral';
  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  const confidenceLevel = modelStats 
    ? modelStats.confidence_score >= 70 
      ? 'Alta' 
      : modelStats.confidence_score >= 40 
        ? 'Média' 
        : 'Baixa'
    : 'N/A';

  const confidenceColor = modelStats
    ? modelStats.confidence_score >= 70
      ? 'bg-success/10 text-success border-success/30'
      : modelStats.confidence_score >= 40
        ? 'bg-warning/10 text-warning border-warning/30'
        : 'bg-destructive/10 text-destructive border-destructive/30'
    : 'bg-muted text-muted-foreground';

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Previsão de Saldo (ML)
            </CardTitle>
            <CardDescription>
              Análise preditiva usando regressão linear baseada em dados históricos
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={daysAhead}
              onChange={(e) => setDaysAhead(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border bg-background text-sm"
              disabled={loading}
            >
              <option value={7}>7 dias</option>
              <option value={15}>15 dias</option>
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
              <option value={90}>90 dias</option>
            </select>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="sm"
              className="hover-scale"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              {loading ? 'Analisando...' : 'Atualizar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {modelStats && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
              <p className="text-2xl font-bold">{formatCurrency(modelStats.current_balance)}</p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Tendência</p>
              <div className="flex items-center gap-2">
                <TrendIcon className={cn("h-5 w-5", trendColor)} />
                <p className={cn("text-xl font-bold", trendColor)}>
                  {formatCurrency(Math.abs(modelStats.slope))} /dia
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Confiança do Modelo</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={confidenceColor}>
                  {confidenceLevel}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {modelStats.confidence_score.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Dados Históricos</p>
              <p className="text-2xl font-bold">{modelStats.data_points} dias</p>
            </div>
          </div>
        )}

        {chartData.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampledData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  className="text-xs"
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 3 }}
                  name="Saldo Histórico"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--warning))', r: 3 }}
                  name="Previsão"
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            {loading ? (
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Analisando dados históricos...</p>
              </div>
            ) : (
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Clique em "Atualizar" para gerar previsões</p>
              </div>
            )}
          </div>
        )}

        {modelStats && modelStats.confidence_score < 40 && (
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
            <p className="text-sm text-warning">
              ⚠️ <strong>Confiança baixa:</strong> O modelo pode não ser preciso devido a dados históricos insuficientes ou irregulares. 
              Adicione mais transações para melhorar a precisão.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Como funciona:</strong> Este modelo usa regressão linear simples para prever seu saldo futuro.</p>
          <p>📊 <strong>R² Score:</strong> {modelStats?.r_squared.toFixed(4) || 'N/A'} (quanto mais próximo de 1, melhor o ajuste)</p>
          <p>🎯 <strong>Precisão:</strong> Baseada em {modelStats?.data_points || 0} dias de histórico de transações</p>
        </div>
      </CardContent>
    </Card>
  );
}
