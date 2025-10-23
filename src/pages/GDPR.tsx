import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Download, Trash2, FileCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function GDPR() {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDataExport = () => {
    toast({
      title: "Exportação Solicitada",
      description: "Receberá um email com os seus dados em breve.",
    });
  };

  const handleDataDeletion = () => {
    toast({
      title: "Solicitação Registada",
      description: "A sua solicitação de eliminação de dados foi registada e será processada em breve.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">RGPD / GDPR</h1>
              <p className="text-muted-foreground">Regulamento Geral de Proteção de Dados</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="animate-scale-in">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Acções Rápidas</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 hover-scale"
                  onClick={handleDataExport}
                >
                  <Download className="h-5 w-5 mb-2" />
                  <div className="text-left">
                    <div className="font-semibold">Exportar os Meus Dados</div>
                    <div className="text-sm text-muted-foreground">
                      Receba uma cópia de todos os seus dados
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col items-start p-4 hover-scale"
                  onClick={handleDataDeletion}
                >
                  <Trash2 className="h-5 w-5 mb-2" />
                  <div className="text-left">
                    <div className="font-semibold">Eliminar os Meus Dados</div>
                    <div className="text-sm text-muted-foreground">
                      Solicite a remoção permanente dos seus dados
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GDPR Information */}
          <Card className="animate-scale-in">
            <CardContent className="prose prose-sm max-w-none pt-6 space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">O Que é o RGPD?</h2>
                <p className="text-muted-foreground">
                  O Regulamento Geral de Proteção de Dados (RGPD) é uma lei de privacidade e segurança da União Europeia 
                  que entrou em vigor em 25 de maio de 2018. O RGPD impõe obrigações às organizações em qualquer lugar, 
                  desde que visem ou recolham dados relacionados com pessoas na UE.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Os Seus Direitos Sob o RGPD</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Direito de Acesso</h3>
                      <p className="text-muted-foreground text-sm">
                        Tem o direito de solicitar cópias dos seus dados pessoais. Podemos cobrar uma pequena taxa por este serviço.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Direito de Retificação</h3>
                      <p className="text-muted-foreground text-sm">
                        Tem o direito de solicitar que corrijamos qualquer informação que considere imprecisa ou incompleta.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Direito ao Apagamento</h3>
                      <p className="text-muted-foreground text-sm">
                        Tem o direito de solicitar que apaguemos os seus dados pessoais, sob certas condições.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Direito de Restringir o Processamento</h3>
                      <p className="text-muted-foreground text-sm">
                        Tem o direito de solicitar que restrinjamos o processamento dos seus dados pessoais, sob certas condições.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Direito de Oposição ao Processamento</h3>
                      <p className="text-muted-foreground text-sm">
                        Tem o direito de se opor ao nosso processamento dos seus dados pessoais, sob certas condições.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Direito à Portabilidade dos Dados</h3>
                      <p className="text-muted-foreground text-sm">
                        Tem o direito de solicitar que transfiramos os dados que recolhemos para outra organização, 
                        ou diretamente para si, sob certas condições.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Como Exercer os Seus Direitos</h2>
                <p className="text-muted-foreground mb-4">
                  Para exercer qualquer um destes direitos, pode:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Utilizar os botões de ação rápida acima para exportar ou eliminar os seus dados</li>
                  <li>Aceder às configurações da sua conta para atualizar as suas informações</li>
                  <li>Contactar-nos diretamente através da aplicação</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Prazo de Resposta</h2>
                <p className="text-muted-foreground">
                  Temos um mês para responder ao seu pedido. Se o seu pedido for particularmente complexo, 
                  informá-lo-emos se precisarmos de tempo adicional (até mais dois meses).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Segurança dos Dados</h2>
                <p className="text-muted-foreground">
                  Implementamos medidas técnicas e organizacionais apropriadas para garantir um nível de segurança 
                  adequado ao risco, incluindo:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controlos de acesso rigorosos</li>
                  <li>Monitorização regular de sistemas</li>
                  <li>Testes de segurança periódicos</li>
                  <li>Formação de pessoal sobre proteção de dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Violações de Dados</h2>
                <p className="text-muted-foreground">
                  Em caso de violação de dados que possa resultar num risco elevado para os seus direitos e liberdades, 
                  notificaremos você e a autoridade de supervisão competente dentro de 72 horas após termos conhecimento da violação.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Transferências Internacionais</h2>
                <p className="text-muted-foreground">
                  Os seus dados são armazenados e processados dentro da União Europeia. Qualquer transferência de dados 
                  para fora da UE será feita de acordo com os requisitos do RGPD.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Apresentar uma Reclamação</h2>
                <p className="text-muted-foreground">
                  Se considerar que o processamento dos seus dados pessoais viola o RGPD, tem o direito de apresentar 
                  uma reclamação junto da Comissão Nacional de Proteção de Dados (CNPD) em Portugal ou da autoridade 
                  de proteção de dados do seu país de residência.
                </p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="font-semibold mb-2">CNPD - Portugal</p>
                  <p className="text-sm text-muted-foreground">
                    Website: <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnpd.pt</a><br />
                    Email: geral@cnpd.pt
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Contacto</h2>
                <p className="text-muted-foreground">
                  Para questões relacionadas com o RGPD ou para exercer os seus direitos, 
                  por favor contacte-nos através da aplicação ou utilize as acções rápidas acima.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
