import { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar, DollarSign, TrendingUp, Settings, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { format, parseISO, isBefore, addDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Alert {
  id: string;
  type: 'overdue' | 'due-soon' | 'budget' | 'goal' | 'system';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  isRead: boolean;
  actionable: boolean;
  amount?: number;
}

export default function Alerts() {
  const { transactions, payables, selectedGroup, formatCurrency } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    overduePayables: true,
    dueSoonPayables: true,
    budgetLimits: true,
    monthlyGoals: true,
    systemNotifications: true,
  });

  // Generate dynamic alerts based on current data
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    const today = new Date();
    const next7Days = addDays(today, 7);
    
    // Filter data by selected group
    const groupPayables = payables.filter(p => p.group === selectedGroup);
    const groupTransactions = transactions.filter(t => t.group === selectedGroup);
    
    // Check for overdue payables
    if (alertSettings.overduePayables) {
      const overduePayables = groupPayables.filter(p => {
        const dueDate = parseISO(p.dueDate);
        return !p.isPaid && isBefore(dueDate, today);
      });

      overduePayables.forEach(payable => {
        alerts.push({
          id: `overdue-${payable.id}`,
          type: 'overdue',
          title: 'Conta Vencida!',
          description: `${payable.description} venceu em ${format(parseISO(payable.dueDate), 'dd/MM/yyyy')}`,
          severity: 'critical',
          date: payable.dueDate,
          isRead: false,
          actionable: true,
          amount: payable.amount,
        });
      });
    }

    // Check for payables due soon
    if (alertSettings.dueSoonPayables) {
      const dueSoonPayables = groupPayables.filter(p => {
        const dueDate = parseISO(p.dueDate);
        return !p.isPaid && dueDate >= today && dueDate <= next7Days;
      });

      dueSoonPayables.forEach(payable => {
        alerts.push({
          id: `due-soon-${payable.id}`,
          type: 'due-soon',
          title: 'Conta Vence em Breve',
          description: `${payable.description} vence em ${format(parseISO(payable.dueDate), 'dd/MM/yyyy')}`,
          severity: 'medium',
          date: payable.dueDate,
          isRead: false,
          actionable: true,
          amount: payable.amount,
        });
      });
    }

    // Check monthly expenses vs budget (example)
    if (alertSettings.budgetLimits) {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      
      const monthlyExpenses = groupTransactions
        .filter(t => {
          const transactionDate = parseISO(t.date);
          return t.type === 'expense' && 
                 transactionDate >= monthStart && 
                 transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const budgetLimit = 5000; // Example budget
      const budgetUsed = (monthlyExpenses / budgetLimit) * 100;

      if (budgetUsed > 80) {
        alerts.push({
          id: 'budget-warning',
          type: 'budget',
          title: budgetUsed > 100 ? 'Orçamento Estourado!' : 'Orçamento Quase no Limite',
          description: `Você já gastou ${formatCurrency(monthlyExpenses)} de ${formatCurrency(budgetLimit)} este mês (${budgetUsed.toFixed(1)}%)`,
          severity: budgetUsed > 100 ? 'critical' : 'high',
          date: today.toISOString(),
          isRead: false,
          actionable: true,
          amount: monthlyExpenses,
        });
      }
    }

    // Monthly goals check
    if (alertSettings.monthlyGoals) {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      
      const monthlyIncome = groupTransactions
        .filter(t => {
          const transactionDate = parseISO(t.date);
          return t.type === 'income' && 
                 transactionDate >= monthStart && 
                 transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const savingsGoal = 2000; // Example savings goal
      const monthlyExpenses = groupTransactions
        .filter(t => {
          const transactionDate = parseISO(t.date);
          return t.type === 'expense' && 
                 transactionDate >= monthStart && 
                 transactionDate <= monthEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const actualSavings = monthlyIncome - monthlyExpenses;
      
      if (actualSavings < savingsGoal) {
        alerts.push({
          id: 'savings-goal',
          type: 'goal',
          title: 'Meta de Economia em Risco',
          description: `Economia atual: ${formatCurrency(actualSavings)}. Meta: ${formatCurrency(savingsGoal)}`,
          severity: 'medium',
          date: today.toISOString(),
          isRead: false,
          actionable: false,
        });
      }
    }

    // System notifications
    if (alertSettings.systemNotifications) {
      alerts.push({
        id: 'system-backup',
        type: 'system',
        title: 'Backup Recomendado',
        description: 'Faça backup dos seus dados financeiros regularmente para manter suas informações seguras.',
        severity: 'low',
        date: today.toISOString(),
        isRead: false,
        actionable: false,
      });
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
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
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