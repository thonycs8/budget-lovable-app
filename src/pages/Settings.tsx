import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/hooks/useSettings';
import { Bell, Globe, DollarSign, Shield } from 'lucide-react';

export default function Settings() {
  const { settings, loading, updateSettings } = useSettings();

  if (loading || !settings) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e notificações
          </p>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações importantes por email
                  </p>
                </div>
                <Switch
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ email_notifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) =>
                    updateSettings({ push_notifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Pagamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado sobre contas a vencer
                  </p>
                </div>
                <Switch
                  checked={settings.payment_reminders}
                  onCheckedChange={(checked) =>
                    updateSettings({ payment_reminders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Resumo Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo das suas finanças toda semana
                  </p>
                </div>
                <Switch
                  checked={settings.weekly_summary}
                  onCheckedChange={(checked) =>
                    updateSettings({ weekly_summary: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Alerts */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Alertas Financeiros
              </CardTitle>
              <CardDescription>
                Configure alertas para eventos financeiros importantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Orçamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Ser notificado quando ultrapassar limites de gastos
                  </p>
                </div>
                <Switch
                  checked={settings.budget_alerts}
                  onCheckedChange={(checked) =>
                    updateSettings({ budget_alerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Investimentos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre mudanças nos investimentos
                  </p>
                </div>
                <Switch
                  checked={settings.investment_alerts}
                  onCheckedChange={(checked) =>
                    updateSettings({ investment_alerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferências de Exibição
              </CardTitle>
              <CardDescription>
                Personalize como as informações são exibidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSettings({ language: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Idioma da interface da aplicação
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Formato de Data</Label>
                <Select
                  value={settings.date_format}
                  onValueChange={(value) => updateSettings({ date_format: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Como as datas são exibidas
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Formato de Números</Label>
                <Select
                  value={settings.number_format}
                  onValueChange={(value) => updateSettings({ number_format: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="european">
                      Europeu (1.234,56)
                    </SelectItem>
                    <SelectItem value="american">
                      Americano (1,234.56)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Formato de exibição de valores
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacidade e Segurança
              </CardTitle>
              <CardDescription>
                Gerencie suas configurações de privacidade e dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Seus dados financeiros são criptografados e armazenados com segurança. 
                Apenas você tem acesso às suas informações.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="/privacy"
                  className="text-sm text-primary hover:underline"
                >
                  Ver Política de Privacidade
                </a>
                <a
                  href="/gdpr"
                  className="text-sm text-primary hover:underline"
                >
                  Gerenciar Dados Pessoais (RGPD)
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
