import { useState } from 'react';
import { Settings, User, Bell, Shield, Download, Upload, Moon, Sun, Globe, DollarSign, Database, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

export default function SettingsPage() {
  const { selectedGroup, setSelectedGroup, transactions, payables, categories } = useApp();
  const { toast } = useToast();
  
  const [userSettings, setUserSettings] = useState({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      sms: false,
      overdueAlerts: true,
      budgetAlerts: true,
      monthlyReports: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false,
    },
    budget: {
      monthlyLimit: 5000,
      savingsGoal: 2000,
      alertThreshold: 80, // percentage
    }
  });

  const handleSaveSettings = () => {
    toast({
      title: 'Configurações salvas!',
      description: 'Suas preferências foram atualizadas com sucesso.',
    });
  };

  const handleExportData = () => {
    const data = {
      transactions,
      payables,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestfin-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Dados exportados!',
      description: 'Backup dos seus dados foi baixado com sucesso.',
    });
  };

  const handleImportData = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'A importação de dados estará disponível em breve.',
    });
  };

  const handleDeleteAllData = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'Esta ação estará disponível com confirmações de segurança.',
      variant: 'destructive',
    });
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setUserSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updateBudgetSetting = (key: string, value: number) => {
    setUserSettings(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [key]: value
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no GestFin
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={userSettings.name}
                onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={userSettings.email}
                onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group">Grupo Padrão</Label>
              <Select value={selectedGroup} onValueChange={(value: 'empresa' | 'familia') => setSelectedGroup(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="familia">Família</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select value={userSettings.theme} onValueChange={(value) => setUserSettings(prev => ({ ...prev, theme: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={userSettings.language} onValueChange={(value) => setUserSettings(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select value={userSettings.currency} onValueChange={(value) => setUserSettings(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Budget Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Orçamento e Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyLimit">Limite Mensal de Gastos</Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={userSettings.budget.monthlyLimit}
                onChange={(e) => updateBudgetSetting('monthlyLimit', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Valor: {formatCurrency(userSettings.budget.monthlyLimit)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="savingsGoal">Meta de Economia Mensal</Label>
              <Input
                id="savingsGoal"
                type="number"
                value={userSettings.budget.savingsGoal}
                onChange={(e) => updateBudgetSetting('savingsGoal', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Valor: {formatCurrency(userSettings.budget.savingsGoal)}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Limite de Alerta (%)</Label>
              <Input
                id="alertThreshold"
                type="number"
                min="0"
                max="100"
                value={userSettings.budget.alertThreshold}
                onChange={(e) => updateBudgetSetting('alertThreshold', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Alertas quando atingir {userSettings.budget.alertThreshold}% do orçamento
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">E-mail</div>
                <div className="text-sm text-muted-foreground">Receber notificações por e-mail</div>
              </div>
              <Switch
                checked={userSettings.notifications.email}
                onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push</div>
                <div className="text-sm text-muted-foreground">Notificações no navegador</div>
              </div>
              <Switch
                checked={userSettings.notifications.push}
                onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Contas Vencidas</div>
                <div className="text-sm text-muted-foreground">Alertas para contas em atraso</div>
              </div>
              <Switch
                checked={userSettings.notifications.overdueAlerts}
                onCheckedChange={(checked) => updateNotificationSetting('overdueAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Limite de Orçamento</div>
                <div className="text-sm text-muted-foreground">Alertas de orçamento</div>
              </div>
              <Switch
                checked={userSettings.notifications.budgetAlerts}
                onCheckedChange={(checked) => updateNotificationSetting('budgetAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Relatórios Mensais</div>
                <div className="text-sm text-muted-foreground">Resumo mensal por e-mail</div>
              </div>
              <Switch
                checked={userSettings.notifications.monthlyReports}
                onCheckedChange={(checked) => updateNotificationSetting('monthlyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Compartilhamento de Dados</div>
                <div className="text-sm text-muted-foreground">Permitir compartilhamento anônimo para melhorias</div>
              </div>
              <Switch
                checked={userSettings.privacy.dataSharing}
                onCheckedChange={(checked) => updatePrivacySetting('dataSharing', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Analytics</div>
                <div className="text-sm text-muted-foreground">Permitir coleta de dados de uso</div>
              </div>
              <Switch
                checked={userSettings.privacy.analytics}
                onCheckedChange={(checked) => updatePrivacySetting('analytics', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Marketing</div>
                <div className="text-sm text-muted-foreground">Receber comunicações promocionais</div>
              </div>
              <Switch
                checked={userSettings.privacy.marketing}
                onCheckedChange={(checked) => updatePrivacySetting('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gerenciamento de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Backup dos Dados</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Faça backup de todas as suas transações e configurações
                </p>
                <Button onClick={handleExportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Restaurar Dados</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Importar dados de um backup anterior
                </p>
                <Button onClick={handleImportData} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2 text-red-600">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
                </p>
                <Button onClick={handleDeleteAllData} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Todos os Dados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Informações do Aplicativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Versão</div>
              <div className="font-medium">1.0.0 <Badge variant="secondary">Beta</Badge></div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Última Atualização</div>
              <div className="font-medium">18 de Janeiro, 2025</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Suporte</div>
              <div className="font-medium">contato@gestfin.app</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}