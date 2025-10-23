import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Bell, Globe, DollarSign, Shield } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Skeleton } from '@/components/ui/skeleton';

export default function Settings() {
  const { settings, loading, updateSettings } = useSettings();

  if (loading) {
    return (
      <div className="flex-1 w-full animate-fade-in">
        <div className="container mx-auto py-8 max-w-4xl px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">Personalize sua experiência no GestFin</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notificações</CardTitle>
              </div>
              <CardDescription>
                Gerencie como e quando você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações e alertas por email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => 
                    updateSettings({ email_notifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) => 
                    updateSettings({ push_notifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payment-reminders">Lembretes de Pagamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes de contas a pagar
                  </p>
                </div>
                <Switch
                  id="payment-reminders"
                  checked={settings.payment_reminders}
                  onCheckedChange={(checked) => 
                    updateSettings({ payment_reminders: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-summary">Resumo Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo das suas finanças toda semana
                  </p>
                </div>
                <Switch
                  id="weekly-summary"
                  checked={settings.weekly_summary}
                  onCheckedChange={(checked) => 
                    updateSettings({ weekly_summary: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Preferências de Exibição</CardTitle>
              </div>
              <CardDescription>
                Personalize como as informações são exibidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSettings({ language: value })}
                >
                  <SelectTrigger id="language" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="date-format">Formato de Data</Label>
                <Select
                  value={settings.date_format}
                  onValueChange={(value) => updateSettings({ date_format: value })}
                >
                  <SelectTrigger id="date-format" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (24/12/2025)</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/24/2025)</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-24)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="number-format">Formato de Números</Label>
                <Select
                  value={settings.number_format}
                  onValueChange={(value) => updateSettings({ number_format: value })}
                >
                  <SelectTrigger id="number-format" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="european">Europeu (1.234,56)</SelectItem>
                    <SelectItem value="american">Americano (1,234.56)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Financial Alerts */}
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <CardTitle>Alertas Financeiros</CardTitle>
              </div>
              <CardDescription>
                Configure alertas para eventos financeiros importantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="budget-alerts">Alertas de Orçamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas quando se aproximar do limite do orçamento
                  </p>
                </div>
                <Switch
                  id="budget-alerts"
                  checked={settings.budget_alerts}
                  onCheckedChange={(checked) => 
                    updateSettings({ budget_alerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="investment-alerts">Alertas de Investimentos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre mudanças significativas nos investimentos
                  </p>
                </div>
                <Switch
                  id="investment-alerts"
                  checked={settings.investment_alerts}
                  onCheckedChange={(checked) => 
                    updateSettings({ investment_alerts: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Privacidade e Segurança</CardTitle>
              </div>
              <CardDescription>
                Gerencie suas preferências de privacidade e segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Para opções avançadas de privacidade, visite:
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="/privacy"
                  className="text-sm text-primary hover:underline"
                >
                  Política de Privacidade
                </a>
                <a
                  href="/gdpr"
                  className="text-sm text-primary hover:underline"
                >
                  Direitos RGPD/GDPR
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
