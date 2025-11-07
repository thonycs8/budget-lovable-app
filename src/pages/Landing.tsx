import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  TrendingUp, 
  PieChart, 
  Bell, 
  Calendar, 
  LineChart, 
  Smartphone, 
  CheckCircle2,
  Globe,
  DollarSign
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Landing() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency, formatCurrency, currencies } = useCurrency();

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('features.predictions.title'),
      description: t('features.predictions.desc')
    },
    {
      icon: <PieChart className="h-6 w-6" />,
      title: t('features.categories.title'),
      description: t('features.categories.desc')
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: t('features.alerts.title'),
      description: t('features.alerts.desc')
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: t('features.calendar.title'),
      description: t('features.calendar.desc')
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: t('features.investments.title'),
      description: t('features.investments.desc')
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t('features.sync.title'),
      description: t('features.sync.desc')
    }
  ];

  const freePlanFeatures = [
    t('pricing.feature.unlimited'),
    t('pricing.feature.categories'),
    t('pricing.feature.reports')
  ];

  const premiumPlanFeatures = [
    ...freePlanFeatures,
    t('pricing.feature.predictions'),
    t('pricing.feature.alerts'),
    t('pricing.feature.support'),
    t('pricing.feature.export')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header/Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xl font-bold">G</span>
              </div>
              <span className="text-xl font-bold">gest-first</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.features')}
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.pricing')}
              </a>
              
              <div className="flex items-center gap-2">
                <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                  <SelectTrigger className="w-[100px]">
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">PT</SelectItem>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="es">ES</SelectItem>
                    <SelectItem value="fr">FR</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
                  <SelectTrigger className="w-[120px]">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currencies).map(([code, config]) => (
                      <SelectItem key={code} value={code}>
                        {config.symbol} {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" onClick={() => navigate('/auth')}>
                {t('nav.login')}
              </Button>
              <Button onClick={() => navigate('/auth')}>
                {t('nav.signup')}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="w-fit">✨ Novo: Previsões com IA</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg">
                {t('hero.cta.primary')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                {t('hero.cta.secondary')}
              </Button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-[300px] h-[600px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[3rem] p-4 shadow-2xl">
              <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden shadow-inner">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-primary/20 rounded"></div>
                    <div className="flex gap-1">
                      <div className="h-3 w-3 bg-success/40 rounded-full"></div>
                      <div className="h-3 w-3 bg-success/40 rounded-full"></div>
                      <div className="h-3 w-3 bg-success/40 rounded-full"></div>
                    </div>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Saldo Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-success">{formatCurrency(15847.50)}</p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-income/10">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">Receitas</p>
                        <p className="text-lg font-bold text-income">{formatCurrency(8500)}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-expense/10">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground">Despesas</p>
                        <p className="text-lg font-bold text-expense">{formatCurrency(3200)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary/20 rounded-full"></div>
                          <div>
                            <div className="h-3 w-20 bg-foreground/20 rounded"></div>
                            <div className="h-2 w-16 bg-foreground/10 rounded mt-1"></div>
                          </div>
                        </div>
                        <div className="h-3 w-12 bg-foreground/20 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-secondary/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover-scale">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            {t('pricing.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('pricing.free.title')}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="outline" onClick={() => navigate('/auth')}>
                {t('pricing.cta.start')}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-primary shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Popular
            </Badge>
            <CardHeader>
              <CardTitle className="text-2xl">{t('pricing.premium.title')}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{formatCurrency(2.99)}</span>
                <span className="text-muted-foreground">{t('pricing.premium.price')}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {premiumPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => navigate('/auth')}>
                {t('pricing.cta.start')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-3xl my-20">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Comece hoje gratuitamente
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de usuários que já transformaram sua gestão financeira
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="text-lg">
            {t('hero.cta.primary')}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-secondary/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold">G</span>
              </div>
              <span className="font-semibold">gest-first</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 gest-first. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
