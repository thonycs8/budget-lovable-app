import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Política de Privacidade</h1>
              <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
            </div>
          </div>
        </div>

        <Card className="animate-scale-in">
          <CardContent className="prose prose-sm max-w-none pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Introdução</h2>
              <p className="text-muted-foreground">
                A GestFin ("nós", "nosso" ou "nossa") respeita a sua privacidade e está comprometida em proteger os seus dados pessoais. 
                Esta política de privacidade informa sobre como tratamos os seus dados pessoais quando utiliza a nossa aplicação de gestão financeira.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Dados que Recolhemos</h2>
              <p className="text-muted-foreground mb-2">Podemos recolher, usar, armazenar e transferir diferentes tipos de dados pessoais sobre si:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Dados de Identidade:</strong> nome completo, nome de utilizador</li>
                <li><strong>Dados de Contacto:</strong> endereço de email, número de telefone</li>
                <li><strong>Dados Financeiros:</strong> informações sobre receitas, despesas, investimentos e contas a pagar que você insere na aplicação</li>
                <li><strong>Dados Técnicos:</strong> endereço IP, tipo de navegador, configurações de fuso horário, tipos de plug-ins do navegador</li>
                <li><strong>Dados de Utilização:</strong> informações sobre como utiliza a nossa aplicação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Como Utilizamos os Seus Dados</h2>
              <p className="text-muted-foreground mb-2">Utilizamos os seus dados pessoais para:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Fornecer e manter a nossa aplicação</li>
                <li>Processar e gerir a sua conta</li>
                <li>Armazenar e processar as suas informações financeiras pessoais</li>
                <li>Melhorar a experiência do utilizador</li>
                <li>Enviar notificações importantes sobre a sua conta</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Segurança dos Dados</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de segurança adequadas para prevenir que os seus dados pessoais sejam acidentalmente perdidos, 
                utilizados ou acedidos de forma não autorizada, alterados ou divulgados. Todas as informações financeiras são 
                criptografadas e armazenadas de forma segura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Partilha de Dados</h2>
              <p className="text-muted-foreground">
                Não vendemos, alugamos ou partilhamos os seus dados pessoais com terceiros para fins de marketing. 
                Os seus dados financeiros são privados e apenas acessíveis por si através da sua conta protegida.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Os Seus Direitos</h2>
              <p className="text-muted-foreground mb-2">De acordo com o RGPD, tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Aceder aos seus dados pessoais</li>
                <li>Corrigir dados pessoais incorretos</li>
                <li>Solicitar a eliminação dos seus dados</li>
                <li>Opor-se ao processamento dos seus dados</li>
                <li>Solicitar a transferência dos seus dados</li>
                <li>Retirar o consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Retenção de Dados</h2>
              <p className="text-muted-foreground">
                Manteremos os seus dados pessoais apenas pelo tempo necessário para cumprir os fins para os quais os recolhemos, 
                incluindo para satisfazer quaisquer requisitos legais, contabilísticos ou de relatório.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Cookies</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies e tecnologias similares para melhorar a sua experiência. Pode controlar o uso de cookies 
                através das configurações do seu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Alterações a Esta Política</h2>
              <p className="text-muted-foreground">
                Podemos atualizar esta política de privacidade periodicamente. Notificaremos sobre quaisquer alterações 
                publicando a nova política nesta página e atualizando a data de "última atualização".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Contacto</h2>
              <p className="text-muted-foreground">
                Se tiver questões sobre esta política de privacidade ou sobre as nossas práticas de privacidade, 
                por favor contacte-nos através da aplicação.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
