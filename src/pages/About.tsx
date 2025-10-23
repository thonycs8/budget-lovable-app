import { Card, CardContent } from '@/components/ui/card';
import { Info, Code, Heart, Shield, Zap, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sobre o GestFin</h1>
              <p className="text-muted-foreground">Gestão Financeira Pessoal Inteligente</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* App Info Card */}
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <span className="text-5xl font-bold">G</span>
                </div>
              </div>
              
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-2xl font-bold">GestFin</h2>
                <p className="text-muted-foreground">Gestão Financeira Pessoal</p>
                <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  Versão 1.0.0
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-center text-muted-foreground">
                <p>
                  A GestFin é uma aplicação moderna e intuitiva projetada para ajudá-lo a 
                  ter controle total sobre suas finanças pessoais. Com uma interface limpa 
                  e recursos poderosos, torne a gestão financeira simples e eficaz.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Controle Financeiro Completo</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerencie receitas, despesas, investimentos e contas a pagar em um só lugar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Interface Intuitiva</h3>
                    <p className="text-sm text-muted-foreground">
                      Design moderno e fácil de usar, com acesso rápido a todas as funcionalidades.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Segurança Total</h3>
                    <p className="text-sm text-muted-foreground">
                      Seus dados financeiros são criptografados e armazenados com segurança máxima.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-scale-in">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Tecnologia Moderna</h3>
                    <p className="text-sm text-muted-foreground">
                      Desenvolvida com React, TypeScript e Supabase para máximo desempenho.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tech Stack */}
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Stack Tecnológica
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">React 18</p>
                  <p className="text-xs text-muted-foreground">UI Framework</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">TypeScript</p>
                  <p className="text-xs text-muted-foreground">Type Safety</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">Supabase</p>
                  <p className="text-xs text-muted-foreground">Backend</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold">Tailwind CSS</p>
                  <p className="text-xs text-muted-foreground">Styling</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Heart className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold mb-2">Desenvolvido com dedicação</p>
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} GestFin. Todos os direitos reservados.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Versão 1.0.0 - Build {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}.{String(new Date().getDate()).padStart(2, '0')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
