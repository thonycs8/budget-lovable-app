import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="flex-1 w-full animate-fade-in">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Termos de Uso</h1>
              <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-PT')}</p>
            </div>
          </div>
        </div>

        <Card className="animate-scale-in">
          <CardContent className="prose prose-sm max-w-none pt-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground">
                Ao aceder e utilizar a GestFin ("Aplicação"), você concorda em estar vinculado a estes Termos de Uso. 
                Se não concordar com qualquer parte destes termos, não deverá utilizar a nossa aplicação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground">
                A GestFin é uma aplicação de gestão financeira pessoal que permite aos utilizadores:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Registar e acompanhar receitas e despesas</li>
                <li>Gerir categorias financeiras</li>
                <li>Acompanhar contas a pagar</li>
                <li>Monitorizar investimentos</li>
                <li>Visualizar relatórios e análises financeiras</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Conta de Utilizador</h2>
              <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Criação de Conta</h3>
              <p className="text-muted-foreground">
                Para utilizar a aplicação, deve criar uma conta fornecendo informações precisas e completas. 
                É responsável por manter a confidencialidade da sua conta e password.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Responsabilidade da Conta</h3>
              <p className="text-muted-foreground">
                Você é responsável por todas as atividades que ocorrem na sua conta. Deve notificar-nos imediatamente 
                de qualquer uso não autorizado da sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Uso Aceitável</h2>
              <p className="text-muted-foreground mb-2">Concorda em NÃO:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Utilizar a aplicação para qualquer fim ilegal ou não autorizado</li>
                <li>Tentar obter acesso não autorizado à aplicação ou aos sistemas relacionados</li>
                <li>Interferir ou interromper a integridade ou desempenho da aplicação</li>
                <li>Transmitir vírus, malware ou qualquer código de natureza destrutiva</li>
                <li>Recolher ou armazenar dados pessoais de outros utilizadores</li>
                <li>Utilizar a aplicação de forma que possa sobrecarregar os nossos servidores</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Propriedade Intelectual</h2>
              <p className="text-muted-foreground">
                A aplicação e todo o seu conteúdo, características e funcionalidades são propriedade da GestFin e 
                estão protegidos por leis de direitos de autor, marcas comerciais e outras leis de propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Dados do Utilizador</h2>
              <p className="text-muted-foreground">
                Você mantém todos os direitos sobre os dados financeiros que introduz na aplicação. Concede-nos 
                uma licença limitada para armazenar e processar esses dados exclusivamente para fornecer o serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground">
                A aplicação é fornecida "como está" e "conforme disponível". Não garantimos que a aplicação estará 
                sempre disponível, ininterrupta ou livre de erros. Não nos responsabilizamos por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Perdas financeiras resultantes de decisões tomadas com base nos dados da aplicação</li>
                <li>Erros ou imprecisões no conteúdo</li>
                <li>Acesso não autorizado aos seus dados devido a falhas de segurança</li>
                <li>Interrupções ou encerramentos do serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Aconselhamento Financeiro</h2>
              <p className="text-muted-foreground">
                A GestFin é uma ferramenta de gestão financeira pessoal e não fornece aconselhamento financeiro, 
                de investimento ou fiscal. Consulte um profissional qualificado para aconselhamento financeiro específico.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Modificações do Serviço</h2>
              <p className="text-muted-foreground">
                Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, a aplicação 
                (ou qualquer parte dela) com ou sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Rescisão</h2>
              <p className="text-muted-foreground">
                Podemos encerrar ou suspender a sua conta imediatamente, sem aviso prévio, por violação destes Termos. 
                Você pode também encerrar a sua conta a qualquer momento através das configurações da aplicação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Lei Aplicável</h2>
              <p className="text-muted-foreground">
                Estes Termos são regidos pelas leis de Portugal. Quaisquer disputas serão resolvidas nos tribunais de Portugal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Alterações aos Termos</h2>
              <p className="text-muted-foreground">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos os utilizadores 
                sobre alterações significativas. O uso continuado da aplicação após alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Contacto</h2>
              <p className="text-muted-foreground">
                Se tiver questões sobre estes Termos de Uso, por favor contacte-nos através da aplicação.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
