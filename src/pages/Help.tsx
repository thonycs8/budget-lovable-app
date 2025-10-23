import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, BookOpen, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Central de Ajuda</h1>
              <p className="text-muted-foreground">Tire suas dúvidas sobre o GestFin</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="animate-scale-in hover-scale cursor-pointer">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Guia Inicial</h3>
                <p className="text-sm text-muted-foreground">
                  Aprenda os primeiros passos
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in hover-scale cursor-pointer">
              <CardContent className="pt-6 text-center">
                <Video className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Tutoriais em Vídeo</h3>
                <p className="text-sm text-muted-foreground">
                  Assista passo a passo
                </p>
              </CardContent>
            </Card>

            <Card className="animate-scale-in hover-scale cursor-pointer">
              <CardContent className="pt-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Suporte</h3>
                <p className="text-sm text-muted-foreground">
                  Entre em contacto connosco
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como começar a usar o GestFin?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>1. Crie sua conta usando email e senha</p>
                      <p>2. Complete seu perfil com informações básicas</p>
                      <p>3. Configure suas categorias financeiras</p>
                      <p>4. Comece a registrar suas receitas e despesas</p>
                      <p>5. Acompanhe seu progresso no Dashboard</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Como adicionar uma nova receita ou despesa?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Existem duas formas fáceis:</p>
                      <p><strong>Opção 1:</strong> Use o menu superior "Adicionar" e selecione "Nova Receita" ou "Nova Despesa"</p>
                      <p><strong>Opção 2:</strong> Navegue até a página específica (Receitas ou Despesas) e clique no botão "Adicionar"</p>
                      <p>Preencha os campos obrigatórios: título, valor, data e categoria (opcional)</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Como criar e gerenciar categorias?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>1. Acesse o menu "Adicionar" no topo da página</p>
                      <p>2. Selecione "Nova Categoria"</p>
                      <p>3. Defina um nome e escolha uma cor para identificação visual</p>
                      <p>4. As categorias podem ser usadas tanto para receitas quanto despesas</p>
                      <p>5. Para editar ou eliminar, vá até a página "Categorias"</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>O que são Contas a Pagar?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Contas a Pagar são compromissos financeiros futuros que você precisa acompanhar.</p>
                      <p>Exemplos: faturas de água, luz, telefone, empréstimos, rendas, etc.</p>
                      <p>O sistema alerta quando existem contas vencidas e não pagas.</p>
                      <p>Você pode marcar uma conta como paga quando efetuar o pagamento.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Como funcionam os Investimentos?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>A seção de Investimentos permite acompanhar seus ativos financeiros:</p>
                      <p>• Registe o valor inicial do investimento</p>
                      <p>• Atualize o valor atual periodicamente</p>
                      <p>• Visualize o lucro ou prejuízo acumulado</p>
                      <p>• Acompanhe diferentes tipos de investimentos (ações, fundos, imóveis, etc.)</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Como usar o Calendário Financeiro?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>O Calendário oferece uma visão cronológica das suas finanças:</p>
                      <p>• Visualize todas as transações organizadas por data</p>
                      <p>• Veja contas a pagar com vencimento próximo</p>
                      <p>• Identifique padrões de gastos ao longo do tempo</p>
                      <p>• Planeje futuros compromissos financeiros</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>Como alterar a moeda e o tema da aplicação?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>1. Clique no seu avatar no canto superior direito</p>
                      <p>2. Selecione "Perfil"</p>
                      <p>3. Na seção "Aparência", escolha seu tema de cores favorito</p>
                      <p>4. Na seção "Preferências Regionais", selecione sua moeda (EUR, BRL, USD)</p>
                      <p>5. As alterações são aplicadas imediatamente</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Os meus dados estão seguros?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Sim! A segurança é nossa prioridade:</p>
                      <p>• Todos os dados são criptografados</p>
                      <p>• Apenas você tem acesso às suas informações financeiras</p>
                      <p>• Seguimos rigorosamente o RGPD/GDPR</p>
                      <p>• Fazemos backups regulares</p>
                      <p>• Não compartilhamos seus dados com terceiros</p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => navigate('/privacy')}
                      >
                        Leia nossa Política de Privacidade
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9">
                  <AccordionTrigger>Posso exportar os meus dados?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Sim! De acordo com o RGPD, você tem direito aos seus dados.</p>
                      <p>1. Acesse a página RGPD/GDPR através do rodapé</p>
                      <p>2. Clique em "Exportar os Meus Dados"</p>
                      <p>3. Receberá um email com todos os seus dados em formato legível</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10">
                  <AccordionTrigger>Como posso eliminar a minha conta?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>Se desejar eliminar permanentemente sua conta e dados:</p>
                      <p>1. Acesse a página RGPD/GDPR através do rodapé</p>
                      <p>2. Clique em "Eliminar os Meus Dados"</p>
                      <p>3. Confirme a solicitação</p>
                      <p>4. Processaremos seu pedido dentro de 30 dias</p>
                      <p className="text-destructive font-semibold">Atenção: Esta ação é irreversível!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="animate-scale-in">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Ainda tem dúvidas?</h3>
              <p className="text-muted-foreground mb-4">
                Nossa equipe está aqui para ajudar!
              </p>
              <p className="text-sm text-muted-foreground">
                Entre em contacto através das configurações da aplicação ou envie um email para suporte@gestfin.app
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
