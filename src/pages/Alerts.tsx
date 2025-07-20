
import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar, DollarSign, TrendingUp, Settings, X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useIncome } from '@/hooks/useIncome';
import { useExpenses } from '@/hooks/useExpenses';
import { usePayables } from '@/hooks/usePayables';
import { format, parseISO, isBefore, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: 'overdue' | 'due-soon' | 'budget' | 'goal' | 'system';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  isRead: boolean;
  isDismissed: boolean;
  actionable: boolean;
  amount?: number;
}

export default function Alerts() {
  const { income } = useIncome();
  const { expenses } = useExpenses();
  const { payables } = usePayables();
  const { toast } = useToast();
  
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    overduePayables: true,
    dueSoonPayables: true,
    budgetLimits: true,
    monthlyGoals: true,
    systemNotifications: true,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Generate dynamic alerts based on current data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    const today = new Date();
    const next7Days = addDays(today, 7);
    
    // Check for overdue payables
    if (alertSettings.overduePayables) {
      const overduePayables = payables.filter(p => {
        const dueDate = parseISO(p.due_date);
        return !p.is_paid && isBefore(dueDate, today);
      });

      overduePayables.forEach(payable => {
        const alertId = `overdue-${payable.id}`;
        if (!dismissedAlerts.includes(alertId)) {
          alerts.push({
            id: alertId,
            type: 'overdue',
            title: 'Conta Vencida!',
            description: `${payable.title} venceu em ${format(parseISO(payable.due_date), 'dd/MM/yyyy')}`,
            severity: 'critical',
            date: payable.due_date,
            isRead: false,
            isDismissed: false,
            actionable: true,
            amount: Number(payable.amount),
          });
        }
      });
    }

    // Check for payables due soon
    if (alertSettings.dueSoonPayables) {
      const dueSoonPayables = payables.filter(p => {
        const dueDate = parseISO(p.due_date);
        return !p.is_paid && dueDate >= today && dueDate <= next7Days;
      });

      dueSoonPayables.forEach(payable => {
        const alertId = `due-soon-${payable.id}`;
        if (!dismissedAlerts.includes(alertId)) {
          alerts.push({
            id: alertId,
            type: 'due-soon',
            title: 'Conta Vence em Breve',
            description: `${payable.title} vence em ${format(parseISO(payable.due_date), 'dd/MM/yyyy')}`,
            severity: 'medium',
            date: payable.due_date,
            isRead: false,
            isDismissed: false,
            actionable: true,
            amount: Number(payable.amount),
          });
        }
      });
    }

    // Check monthly expenses vs budget (example)
    if (alertSettings.budgetLimits) {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      
      const monthlyExpenses = expenses
        .filter(e => {
          const expenseDate = parseISO(e.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const budgetLimit = 5000; // Example budget
      const budgetUsed = (monthlyExpenses / budgetLimit) * 100;

      if (budgetUsed > 80) {
        const alertId = 'budget-warning';
        if (!dismissedAlerts.includes(alertId)) {
          alerts.push({
            id: alertId,
            type: 'budget',
            title: budgetUsed > 100 ? 'Orçamento Estourado!' : 'Orçamento Quase no Limite',
            description: `Você já gastou ${formatCurrency(monthlyExpenses)} de ${formatCurrency(budgetLimit)} este mês (${budgetUsed.toFixed(1)}%)`,
            severity: budgetUsed > 100 ? 'critical' : 'high',
            date: today.toISOString(),
            isRead: false,
            isDismissed: false,
            actionable: true,
            amount: monthlyExpenses,
          });
        }
      }
    }

    // Monthly goals check
    if (alertSettings.monthlyGoals) {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      
      const monthlyIncome = income
        .filter(i => {
          const incomeDate = parseISO(i.date);
          return incomeDate >= monthStart && incomeDate <= monthEnd;
        })
        .reduce((sum, i) => sum + Number(i.amount), 0);

      const savingsGoal = 2000; // Example savings goal
      const monthlyExpenses = expenses
        .filter(e => {
          const expenseDate = parseISO(e.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        })
        .reduce((sum, e) => sum + Number(e.amount), 0);

      const actualSavings = monthlyIncome - monthlyExpenses;
      
      if (actualSavings < savingsGoal) {
        const alertId = 'savings-goal';
        if (!dismissedAlerts.includes(alertId)) {
          alerts.push({
            id: alertId,
            type: 'goal',
            title: 'Meta de Economia em Risco',
            description: `Economia atual: ${formatCurrency(actualSavings)}. Meta: ${formatCurrency(savingsGoal)}`,
            severity: 'medium',
            date: today.toISOString(),
            isRead: false,
            isDismissed: false,
            actionable: false,
          });
        }
      }
    }

    // System notifications
    if (alertSettings.systemNotifications) {
      const alertId = 'system-backup';
      if (!dismissedAlerts.includes(alertId)) {
        alerts.push({
          id: alertId,
          type: 'system',
          title: 'Backup Recomendado',
          description: 'Faça backup dos seus dados financeiros regularmente para manter suas informações seguras.',
          severity: 'low',
          date: today.toISOString(),
          isRead: false,
          isDismissed: false,
          actionable: false,
        });
      }
    }

    return alerts.sort((a, b) => {
      // Sort by severity first, then by date
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  const currentAlerts = generateAlerts();
  const filteredAlerts = showOnlyUnread ? currentAlerts.filter(alert => !alert.isRead) : currentAlerts;

  const markAsRead = (alertId: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Alerta marcado como lido",
      description: "O alerta foi marcado como lido.",
    });
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    toast({
      title: "Alerta removido",
      description: "O alerta foi removido da sua lista.",
    });
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle;
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Clock;
      case 'low':
        return Bell;
      default:
        return Bell;
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'overdue':
        return X;
      case 'due-soon':
        return Calendar;
      case 'budget':
        return DollarSign;
      case 'goal':
        return TrendingUp;
      case 'system':
        return Settings;
      default:
        return Bell;
    }
  };

  const unreadCount = currentAlerts.filter(alert => !alert.isRead).length;
  const criticalCount = currentAlerts.filter(alert => alert.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Alertas
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Fique por dentro de todas as suas pendências financeiras
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-unread"
              checked={showOnlyUnread}
              onCheckedChange={setShowOnlyUnread}
            />
            <label htmlFor="show-unread" className="text-sm">
              Apenas não lidos
            </label>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {unreadCount} não lidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">
              Requerem ação imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Vencidas</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {currentAlerts.filter(a => a.type === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Contas em atraso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencem em Breve</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {currentAlerts.filter(a => a.type === 'due-soon').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Contas Vencidas</div>
                <div className="text-sm text-muted-foreground">Alertas para contas em atraso</div>
              </div>
              <Switch
                checked={alertSettings.overduePayables}
                onCheckedChange={(checked) => 
                  setAlertSettings(prev => ({ ...prev, overduePayables: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Contas a Vencer</div>
                <div className="text-sm text-muted-foreground">Alertas para contas próximas do vencimento</div>
              </div>
              <Switch
                checked={alertSettings.dueSoonPayables}
                onCheckedChange={(checked) => 
                  setAlertSettings(prev => ({ ...prev, dueSoonPayables: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Limite de Orçamento</div>
                <div className="text-sm text-muted-foreground">Alertas quando orçamento estiver no limite</div>
              </div>
              <Switch
                checked={alertSettings.budgetLimits}
                onCheckedChange={(checked) => 
                  setAlertSettings(prev => ({ ...prev, budgetLimits: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Metas Mensais</div>
                <div className="text-sm text-muted-foreground">Alertas sobre progresso das metas</div>
              </div>
              <Switch
                checked={alertSettings.monthlyGoals}
                onCheckedChange={(checked) => 
                  setAlertSettings(prev => ({ ...prev, monthlyGoals: checked }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum alerta encontrado</h3>
              <p className="text-muted-foreground">
                {showOnlyUnread 
                  ? 'Todos os alertas foram lidos!'
                  : 'Suas finanças estão em dia!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                const TypeIcon = getTypeIcon(alert.type);
                
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                      alert.isRead ? 'bg-muted/30' : 'bg-background hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                        <SeverityIcon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <TypeIcon className="h-4 w-4" />
                            {alert.title}
                            {!alert.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {alert.description}
                          </p>
                        </div>
                        {alert.amount && (
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(alert.amount)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(alert.date), "dd 'de' MMMM", { locale: ptBR })}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {alert.actionable && (
                            <Button variant="outline" size="sm">
                              Resolver
                            </Button>
                          )}
                          {!alert.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => markAsRead(alert.id)}
                            >
                              Marcar como lido
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover Alerta</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover este alerta?
                                  Ele não aparecerá mais na sua lista.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => dismissAlert(alert.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
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
