import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExpenses } from '@/hooks/useExpenses';
import { useIncome } from '@/hooks/useIncome';
import { usePayables } from '@/hooks/usePayables';
import { usePredictions } from '@/hooks/usePredictions';
import { useReminders } from '@/hooks/useReminders';
import { useCurrency } from '@/hooks/useCurrency';
import { TrendingDown, TrendingUp, Clock, Sparkles, Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PredictiveCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { expenses } = useExpenses();
  const { income } = useIncome();
  const { payables } = usePayables();
  const { predictions, generatePredictions, loading: predictionsLoading } = usePredictions();
  const { reminders, getActiveReminders } = useReminders();
  const { formatCurrency } = useCurrency();

  const activeReminders = getActiveReminders();

  // Group all events by date
  const eventsByDate = useMemo(() => {
    const events = new Map<string, any[]>();

    // Add expenses
    expenses.forEach(exp => {
      const date = exp.date;
      if (!events.has(date)) events.set(date, []);
      events.get(date)!.push({ ...exp, type: 'expense', source: 'confirmed' });
    });

    // Add income
    income.forEach(inc => {
      const date = inc.date;
      if (!events.has(date)) events.set(date, []);
      events.get(date)!.push({ ...inc, type: 'income', source: 'confirmed' });
    });

    // Add payables
    payables.forEach(pay => {
      const date = pay.due_date;
      if (!events.has(date)) events.set(date, []);
      events.get(date)!.push({ ...pay, type: 'payable', source: 'confirmed', isPaid: pay.is_paid });
    });

    // Add predictions
    predictions.forEach(pred => {
      const date = pred.predicted_date;
      if (!events.has(date)) events.set(date, []);
      events.get(date)!.push({ 
        ...pred, 
        type: 'prediction',
        source: pred.prediction_source,
        amount: pred.predicted_amount 
      });
    });

    return events;
  }, [expenses, income, payables, predictions]);

  const selectedDateEvents = selectedDate 
    ? eventsByDate.get(selectedDate.toISOString().split('T')[0]) || []
    : [];

  const getDayEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return eventsByDate.get(dateStr) || [];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Active Reminders */}
      {activeReminders.length > 0 && (
        <Card className="border-warning bg-warning/5 animate-in slide-in-from-top">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Bell className="h-5 w-5 animate-pulse" />
              Lembretes Ativos ({activeReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeReminders.map(reminder => (
              <div 
                key={reminder.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background border"
              >
                <div>
                  <p className="font-medium">{reminder.title}</p>
                  <p className="text-sm text-muted-foreground">{reminder.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vencimento: {new Date(reminder.due_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant="outline" className="border-warning text-warning">
                  {reminder.reminder_type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Calendar */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar View */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Calendário Preditivo
              </CardTitle>
              <Button
                onClick={generatePredictions}
                disabled={predictionsLoading}
                size="sm"
                className="hover-scale"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", predictionsLoading && "animate-spin")} />
                Gerar Previsões
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border"
              modifiers={{
                hasExpense: (date) => getDayEvents(date).some(e => e.type === 'expense' && e.source === 'confirmed'),
                hasIncome: (date) => getDayEvents(date).some(e => e.type === 'income' && e.source === 'confirmed'),
                hasPrediction: (date) => getDayEvents(date).some(e => e.type === 'prediction'),
                hasOverdue: (date) => getDayEvents(date).some(e => e.type === 'payable' && !e.isPaid && new Date(e.due_date) < new Date()),
              }}
              modifiersClassNames={{
                hasOverdue: 'bg-destructive/20 font-bold',
                hasPrediction: 'bg-warning/10 border border-warning/30',
                hasExpense: 'bg-expense/10',
                hasIncome: 'bg-income/10',
              }}
            />
            
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Legenda:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="bg-income/10 border-income/30">
                  Receitas
                </Badge>
                <Badge variant="outline" className="bg-expense/10 border-expense/30">
                  Despesas
                </Badge>
                <Badge variant="outline" className="bg-warning/10 border-warning/30">
                  Previsões
                </Badge>
                <Badge variant="outline" className="bg-destructive/20 border-destructive">
                  Em atraso
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Detail */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? `Eventos de ${selectedDate.toLocaleDateString('pt-BR', { dateStyle: 'long' })}`
                : 'Selecione uma data'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                <TabsTrigger value="predicted">Previsões</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-2 mt-4">
                {selectedDateEvents.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhum evento nesta data
                  </p>
                ) : (
                  selectedDateEvents.map((event, idx) => (
                    <EventCard key={idx} event={event} formatCurrency={formatCurrency} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-2 mt-4">
                {selectedDateEvents.filter(e => e.source === 'confirmed').map((event, idx) => (
                  <EventCard key={idx} event={event} formatCurrency={formatCurrency} />
                ))}
              </TabsContent>

              <TabsContent value="predicted" className="space-y-2 mt-4">
                {selectedDateEvents.filter(e => e.type === 'prediction').map((event, idx) => (
                  <EventCard key={idx} event={event} formatCurrency={formatCurrency} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Resumo de Previsões (Próximos 30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Total Previsto</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  predictions
                    .filter(p => {
                      const date = new Date(p.predicted_date);
                      const today = new Date();
                      const thirtyDays = new Date(today);
                      thirtyDays.setDate(today.getDate() + 30);
                      return date >= today && date <= thirtyDays;
                    })
                    .reduce((sum, p) => sum + Number(p.predicted_amount), 0)
                )}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-success/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Previsões Recorrentes</p>
              <p className="text-2xl font-bold text-success">
                {predictions.filter(p => p.prediction_source === 'recurring').length}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-warning/5 to-transparent border">
              <p className="text-sm text-muted-foreground mb-1">Baseadas em Padrões</p>
              <p className="text-2xl font-bold text-warning">
                {predictions.filter(p => p.prediction_source === 'pattern').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EventCard({ event, formatCurrency }: { event: any; formatCurrency: (n: number) => string }) {
  const getIcon = () => {
    if (event.type === 'income') return <TrendingUp className="h-4 w-4 text-income" />;
    if (event.type === 'expense') return <TrendingDown className="h-4 w-4 text-expense" />;
    if (event.type === 'payable') return <Clock className="h-4 w-4 text-warning" />;
    return <Sparkles className="h-4 w-4 text-primary" />;
  };

  const getColor = () => {
    if (event.type === 'income') return 'border-income/30 bg-income/5';
    if (event.type === 'expense') return 'border-expense/30 bg-expense/5';
    if (event.type === 'payable') return 'border-warning/30 bg-warning/5';
    return 'border-primary/30 bg-primary/5';
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all hover:shadow-md",
      getColor()
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          {getIcon()}
          <div>
            <p className="font-medium">{event.title}</p>
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
            {event.notes && (
              <p className="text-xs text-muted-foreground italic mt-1">{event.notes}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold">{formatCurrency(Number(event.amount))}</p>
          {event.confidence_score !== undefined && (
            <Badge variant="outline" className="text-xs mt-1">
              {Math.round(event.confidence_score * 100)}% confiança
            </Badge>
          )}
          {event.type === 'prediction' && (
            <Badge variant="secondary" className="text-xs mt-1">
              {event.source === 'recurring' ? 'Recorrente' : 'Padrão'}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
