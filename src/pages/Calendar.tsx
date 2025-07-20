import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, DollarSign, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';
import { usePayables } from '@/hooks/usePayables';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import IncomeForm from '@/components/forms/IncomeForm';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { PayableForm } from '@/components/forms/PayableForm';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'payable' | 'payable-overdue';
  date: string;
  category: string;
  isPaid?: boolean;
}

export default function Calendar() {
  const { income, loading: incomeLoading } = useIncome();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { payables, loading: payablesLoading } = usePayables();
  const { categories } = useCategories();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isPayableFormOpen, setIsPayableFormOpen] = useState(false);

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
          <p className="text-muted-foreground">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  // Generate calendar events
  const calendarEvents = useMemo((): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    // Add income
    income.forEach(incomeItem => {
      events.push({
        id: incomeItem.id,
        title: incomeItem.title,
        amount: Number(incomeItem.amount),
        type: 'income',
        date: incomeItem.date,
        category: incomeItem.category_id || '',
      });
    });

    // Add expenses
    expenses.forEach(expense => {
      events.push({
        id: expense.id,
        title: expense.title,
        amount: Number(expense.amount),
        type: 'expense',
        date: expense.date,
        category: expense.category_id || '',
      });
    });

    // Add payables
    payables.forEach(payable => {
      const dueDate = new Date(payable.due_date);
      const isOverdue = dueDate < new Date() && !payable.is_paid;
      
      events.push({
        id: payable.id,
        title: payable.title,
        amount: Number(payable.amount),
        type: isOverdue ? 'payable-overdue' : 'payable',
        date: payable.due_date,
        category: payable.category_id || '',
        isPaid: payable.is_paid,
      });
    });

    return events;
  }, [income, expenses, payables]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return calendarEvents.filter(event => 
      isSameDay(parseISO(event.date), date)
    );
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Calculate totals for current month
  const monthlyTotals = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    const monthEvents = calendarEvents.filter(event => {
      const eventDate = parseISO(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });

    const income = monthEvents
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const expenses = monthEvents
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const pendingPayables = monthEvents
      .filter(e => (e.type === 'payable' || e.type === 'payable-overdue') && !e.isPaid)
      .reduce((sum, e) => sum + e.amount, 0);

    return { income, expenses, pendingPayables };
  }, [calendarEvents, currentDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Sem categoria';
  };

  const getEventTypeStyles = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'income':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'expense':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'payable':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'payable-overdue':
        return 'bg-red-200 text-red-900 border-red-300 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Calendário Financeiro
          </h1>
          <p className="text-muted-foreground">
            Visualize suas finanças por data
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsIncomeFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Receita</span>
            <span className="sm:hidden">+R</span>
          </Button>

          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsExpenseFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Despesa</span>
            <span className="sm:hidden">+D</span>
          </Button>

          <Button 
            size="sm"
            className="flex items-center gap-2"
            disabled
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Conta a Pagar</span>
            <span className="sm:hidden">+C</span>
          </Button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(monthlyTotals.income)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(monthlyTotals.expenses)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(monthlyTotals.pendingPayables)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid - Mobile Optimized */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border rounded cursor-pointer transition-colors",
                    isCurrentMonth ? "bg-background" : "bg-muted/50",
                    isCurrentDay && "ring-1 sm:ring-2 ring-primary",
                    selectedDate && isSameDay(day, selectedDate) && "bg-primary/10",
                    "hover:bg-muted/80 active:bg-muted/90"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={cn(
                    "text-xs sm:text-sm font-medium mb-1",
                    !isCurrentMonth && "text-muted-foreground",
                    isCurrentDay && "text-primary font-bold"
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-0.5 sm:space-y-1">
                    {/* Mobile: Show only dots for events */}
                    <div className="flex sm:hidden gap-0.5 flex-wrap">
                      {dayEvents.slice(0, 4).map((event, index) => (
                        <div
                          key={`${event.id}-${index}`}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            event.type === 'income' && "bg-emerald-500",
                            event.type === 'expense' && "bg-red-500",
                            event.type === 'payable' && "bg-orange-500",
                            event.type === 'payable-overdue' && "bg-red-600 animate-pulse"
                          )}
                        />
                      ))}
                      {dayEvents.length > 4 && (
                        <div className="text-[8px] text-muted-foreground ml-0.5">
                          +{dayEvents.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Desktop: Show event cards */}
                    <div className="hidden sm:block">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs p-1 rounded border",
                            getEventTypeStyles(event.type)
                          )}
                        >
                          <div className="truncate font-medium">{event.title}</div>
                          <div className="text-xs">
                            {formatCurrency(event.amount)}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayEvents.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Detalhes de {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const dayEvents = getEventsForDate(selectedDate);
              
              if (dayEvents.length === 0) {
                return (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhum evento neste dia</h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione transações ou contas a pagar para este dia
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        getEventTypeStyles(event.type)
                      )}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm opacity-75">
                          {getCategoryName(event.category)}
                        </div>
                        {event.isPaid !== undefined && (
                          <Badge variant={event.isPaid ? "default" : "destructive"} className="mt-1">
                            {event.isPaid ? "Pago" : "Pendente"}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(event.amount)}
                        </div>
                        <div className="text-xs opacity-75">
                          {event.type === 'income' ? 'Receita' :
                           event.type === 'expense' ? 'Despesa' :
                           'Conta a Pagar'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
      
      <IncomeForm isOpen={isIncomeFormOpen} onClose={() => setIsIncomeFormOpen(false)} />
      <ExpenseForm isOpen={isExpenseFormOpen} onClose={() => setIsExpenseFormOpen(false)} />
    </div>
  );
}