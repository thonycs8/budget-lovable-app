# ✅ Checklist Pós-Deploy - GestFin

## 📋 Índice

1. [Verificação Inicial](#verificação-inicial)
2. [Segurança](#segurança)
3. [Produção](#produção)
4. [Domínio Customizado](#domínio-customizado)
5. [Monitoramento Contínuo](#monitoramento-contínuo)

---

## 🔍 Verificação Inicial

### Lovable Platform

- [ ] **Deploy bem-sucedido**
  - [ ] Build completou sem erros
  - [ ] Preview URL está acessível
  - [ ] Aplicação carrega corretamente

- [ ] **Funcionalidades principais**
  - [ ] Dashboard exibe métricas corretamente
  - [ ] Todas as páginas são acessíveis (Income, Expenses, Categories, etc.)
  - [ ] Navegação entre páginas funciona
  - [ ] Sidebar expande/colapsa corretamente
  - [ ] Footer exibe informações corretas

- [ ] **Responsividade**
  - [ ] Teste em desktop (1920px, 1366px)
  - [ ] Teste em tablet (768px, 1024px)
  - [ ] Teste em mobile (375px, 414px)
  - [ ] Touch interactions funcionam em dispositivos móveis

### Supabase Integration

- [ ] **Conexão com banco de dados**
  - [ ] Cliente Supabase inicializa corretamente
  - [ ] Queries retornam dados esperados
  - [ ] Mutations (INSERT/UPDATE/DELETE) funcionam

- [ ] **Autenticação**
  - [ ] Página `/auth` carrega corretamente
  - [ ] Sign up com email/senha funciona
  - [ ] Login com email/senha funciona
  - [ ] Logout funciona e limpa sessão
  - [ ] Redirecionamentos após login/logout estão corretos
  - [ ] Sessão persiste após reload da página
  - [ ] Token refresh automático funciona

- [ ] **Tabelas e dados**
  - [ ] Todas as tabelas existem (categories, expenses, income, investments, payables, profiles, user_settings)
  - [ ] Dados são criados corretamente
  - [ ] Dados são atualizados corretamente
  - [ ] Dados são deletados corretamente
  - [ ] Relações entre tabelas funcionam (foreign keys)

- [ ] **Edge Functions** (se implementadas)
  - [ ] Functions deployadas com sucesso
  - [ ] Endpoints respondem corretamente
  - [ ] Logs não mostram erros críticos
  - [ ] Timeouts configurados adequadamente

### Stripe Integration

- [ ] **Configuração básica**
  - [ ] API keys (secret e publishable) configuradas
  - [ ] Webhooks configurados e recebendo eventos
  - [ ] Webhook secret configurado corretamente

- [ ] **Produtos e preços** (se aplicável)
  - [ ] Produtos criados no Stripe Dashboard
  - [ ] Preços configurados corretamente
  - [ ] Moeda está correta (BRL, USD, EUR, etc.)

- [ ] **Fluxos de pagamento** (se implementados)
  - [ ] Checkout Session cria corretamente
  - [ ] Redirecionamentos após pagamento funcionam
  - [ ] Webhooks processam eventos (payment_intent.succeeded, etc.)
  - [ ] Dados de pagamento salvos no banco

---

## 🔒 Segurança

### Supabase RLS (Row Level Security)

- [ ] **RLS habilitado em todas as tabelas**
  ```sql
  -- Verificar com Supabase Linter
  SELECT tablename 
  FROM pg_tables 
  WHERE schemaname = 'public' 
  AND tablename NOT IN (
    SELECT tablename 
    FROM pg_policies 
    WHERE schemaname = 'public'
  );
  ```

- [ ] **Policies de SELECT**
  - [ ] `categories`: usuários veem apenas suas categorias
  - [ ] `expenses`: usuários veem apenas suas despesas
  - [ ] `income`: usuários veem apenas suas receitas
  - [ ] `investments`: usuários veem apenas seus investimentos
  - [ ] `payables`: usuários veem apenas suas contas
  - [ ] `profiles`: usuários veem apenas seu perfil
  - [ ] `user_settings`: usuários veem apenas suas configurações

- [ ] **Policies de INSERT**
  - [ ] Todas as tabelas verificam `auth.uid() = user_id`
  - [ ] Não é possível criar registros para outros usuários

- [ ] **Policies de UPDATE**
  - [ ] Usuários podem atualizar apenas seus próprios dados
  - [ ] Validações de dados implementadas

- [ ] **Policies de DELETE**
  - [ ] Usuários podem deletar apenas seus próprios dados
  - [ ] Cascade deletes configurados corretamente

- [ ] **Linter Supabase**
  - [ ] Executar linter: `supabase db lint`
  - [ ] Resolver todos os warnings de nível CRITICAL
  - [ ] Revisar warnings de nível HIGH
  - [ ] Documentar warnings aceitos de nível LOW

### Validação de Inputs

- [ ] **Client-side (React Hook Form + Zod)**
  - [ ] Formulários validam antes de enviar
  - [ ] Mensagens de erro são claras
  - [ ] Validações incluem:
    - [ ] Campos obrigatórios
    - [ ] Formatos de email
    - [ ] Comprimento mínimo/máximo
    - [ ] Valores numéricos positivos
    - [ ] Datas válidas

- [ ] **Server-side (Edge Functions)**
  - [ ] Validação duplicada no servidor
  - [ ] Proteção contra SQL injection (usando prepared statements)
  - [ ] Sanitização de inputs HTML
  - [ ] Rate limiting implementado

- [ ] **Senhas**
  - [ ] Força mínima: 8 caracteres
  - [ ] Requer letras maiúsculas e minúsculas
  - [ ] Requer números
  - [ ] Requer caracteres especiais
  - [ ] Não mostra senha em logs

### Segredos e Variáveis de Ambiente

- [ ] **Supabase Secrets**
  - [ ] `STRIPE_SECRET_KEY` configurada
  - [ ] `STRIPE_WEBHOOK_SECRET` configurada
  - [ ] Outras secrets necessárias configuradas
  - [ ] Secrets não expostas no código cliente

- [ ] **Keys públicas seguras**
  - [ ] `SUPABASE_ANON_KEY` é pública e segura
  - [ ] Stripe Publishable Key pode ser exposta

- [ ] **Logs e Debugging**
  - [ ] `console.log` de dados sensíveis removidos
  - [ ] Logs de produção apenas em modo DEV
  - [ ] Stack traces não expõem secrets

### GDPR e Privacidade

- [ ] **Páginas legais**
  - [ ] Política de Privacidade (`/privacy`) publicada
  - [ ] Termos de Serviço (`/terms`) publicados
  - [ ] Página GDPR (`/gdpr`) explicando direitos

- [ ] **Consentimento**
  - [ ] Cookie banner (se aplicável)
  - [ ] Opt-in para emails marketing
  - [ ] Opt-out disponível

- [ ] **Direito ao Esquecimento**
  - [ ] Funcionalidade de deletar conta
  - [ ] Cascade delete remove todos os dados do usuário
  - [ ] Backups respeitam GDPR

### Autenticação Avançada

- [ ] **Configurações Supabase Auth**
  - [ ] Email confirmation desabilitada para testes, habilitada em produção
  - [ ] Redirect URLs configuradas:
    - [ ] Preview URL: `https://yourapp.lovable.app`
    - [ ] Production URL: `https://yourdomain.com`
  - [ ] Site URL configurada corretamente

- [ ] **Multi-fator (MFA)** (opcional)
  - [ ] MFA habilitado no Supabase Dashboard
  - [ ] Fluxo de setup de MFA implementado
  - [ ] Recovery codes gerados

- [ ] **OAuth Providers** (opcional)
  - [ ] Google Sign-In configurado
  - [ ] Credenciais OAuth seguras
  - [ ] Redirect URIs registrados

---

## 🚀 Produção

### Performance

- [ ] **Carregamento inicial**
  - [ ] First Contentful Paint (FCP) < 1.8s
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] Time to Interactive (TTI) < 3.5s
  - [ ] Cumulative Layout Shift (CLS) < 0.1

- [ ] **React Query**
  - [ ] Cache configurado corretamente (5min stale time)
  - [ ] Garbage collection após 10min
  - [ ] Optimistic updates implementados
  - [ ] Retry logic configurado

- [ ] **Zustand**
  - [ ] Estado persiste em localStorage
  - [ ] Sincronização offline funciona
  - [ ] Pending changes rastreados
  - [ ] Sync automático ao reconectar

- [ ] **Imagens e Assets**
  - [ ] Imagens otimizadas (WebP/AVIF)
  - [ ] Lazy loading implementado
  - [ ] SVGs minificados
  - [ ] Favicon presente

### Supabase Production

- [ ] **Database Optimization**
  - [ ] Índices criados em colunas frequently queried:
    ```sql
    CREATE INDEX idx_expenses_user_id ON expenses(user_id);
    CREATE INDEX idx_expenses_date ON expenses(date);
    CREATE INDEX idx_income_user_id ON income(user_id);
    CREATE INDEX idx_payables_due_date ON payables(due_date);
    ```
  - [ ] Query performance analisada (EXPLAIN ANALYZE)
  - [ ] Connection pooling configurado

- [ ] **Backups**
  - [ ] Backups automáticos habilitados
  - [ ] Ponto de restauração testado
  - [ ] Backup manual realizado antes de deploy

- [ ] **Rate Limits**
  - [ ] Rate limiting em Edge Functions
  - [ ] Throttling em mutations pesadas
  - [ ] DDoS protection via Supabase

### Stripe Production

- [ ] **Modo de Produção**
  - [ ] Live keys (não test keys) configuradas
  - [ ] Ambiente de produção ativado no Stripe Dashboard

- [ ] **Webhooks**
  - [ ] Endpoint público acessível
  - [ ] SSL certificado válido
  - [ ] Signature validation implementada
  - [ ] Retry logic do Stripe configurado

- [ ] **Compliance**
  - [ ] PCI DSS compliance (Stripe cuida)
  - [ ] SCA (Strong Customer Authentication) habilitada
  - [ ] Impostos configurados (se aplicável)

### Monitoramento de Erros

- [ ] **Sentry / Error Tracking** (opcional)
  - [ ] Sentry integrado
  - [ ] Source maps enviados
  - [ ] Alerts configurados

- [ ] **Supabase Logs**
  - [ ] Logs de Auth revisados
  - [ ] Logs de Database revisados
  - [ ] Logs de Edge Functions revisados
  - [ ] Alertas para erros críticos configurados

### Testes Finais

- [ ] **Fluxos críticos**
  - [ ] Novo usuário: Sign up → Onboarding → Dashboard
  - [ ] Usuário existente: Login → Dashboard → Adicionar Expense
  - [ ] Pagamento (se aplicável): Checkout → Webhook → Confirmação

- [ ] **Testes de carga** (opcional)
  - [ ] 10 usuários simultâneos
  - [ ] 100 requisições/min
  - [ ] Sem timeouts ou crashes

---

## 🌐 Domínio Customizado

### Configuração DNS

- [ ] **Requisitos**
  - [ ] Plano pago Lovable ativo
  - [ ] Acesso ao registrador de domínio (GoDaddy, Namecheap, etc.)

- [ ] **Registros DNS**
  - [ ] **A Record** para root domain:
    - Type: `A`
    - Name: `@`
    - Value: `185.158.133.1`
    - TTL: `3600` (ou automático)
  
  - [ ] **A Record** para www subdomain:
    - Type: `A`
    - Name: `www`
    - Value: `185.158.133.1`
    - TTL: `3600` (ou automático)

- [ ] **Verificação DNS**
  - [ ] Usar [DNSChecker.org](https://dnschecker.org) para verificar propagação
  - [ ] Registros visíveis em múltiplos locais
  - [ ] Aguardar até 24-48h para propagação completa

### Lovable Domain Settings

- [ ] **Conectar domínio**
  - [ ] Ir para Project Settings → Domains
  - [ ] Clicar "Connect Domain"
  - [ ] Inserir nome do domínio (ex: `myapp.com`)
  - [ ] Seguir instruções de verificação

- [ ] **Verificação**
  - [ ] Status mostra "Verified" ou "Active"
  - [ ] SSL certificate provisionado automaticamente
  - [ ] HTTPS funciona sem warnings

### Supabase Redirect URLs

- [ ] **Atualizar Auth URLs**
  - [ ] Ir para Supabase Dashboard → Authentication → URL Configuration
  - [ ] **Site URL**: `https://yourdomain.com`
  - [ ] **Redirect URLs**: Adicionar:
    - [ ] `https://yourdomain.com/**`
    - [ ] `https://www.yourdomain.com/**`
    - [ ] `https://yourapp.lovable.app/**` (manter para rollback)

### Stripe Webhooks

- [ ] **Atualizar endpoint**
  - [ ] Ir para Stripe Dashboard → Webhooks
  - [ ] Editar webhook existente ou criar novo
  - [ ] Endpoint URL: `https://yourdomain.com/api/stripe-webhook`
  - [ ] Selecionar eventos necessários
  - [ ] Testar webhook com evento de teste

### Testes Pós-Domínio

- [ ] **Acesso**
  - [ ] `https://yourdomain.com` carrega aplicação
  - [ ] `https://www.yourdomain.com` funciona (com ou sem www)
  - [ ] Redirecionamento HTTP → HTTPS automático
  - [ ] Certificado SSL válido (cadeado verde no navegador)

- [ ] **Funcionalidade**
  - [ ] Login funciona com novo domínio
  - [ ] Redirects após autenticação corretos
  - [ ] Webhooks Stripe chegam no novo endpoint
  - [ ] Email notifications usam novo domínio

### Troubleshooting Domínio

- [ ] **Se domínio não verifica**
  - [ ] Confirmar A Records apontam para `185.158.133.1`
  - [ ] Remover registros conflitantes (AAAA, CNAME no root)
  - [ ] Verificar com `dig yourdomain.com` ou `nslookup yourdomain.com`
  - [ ] Aguardar mais tempo (até 48h)

- [ ] **Se SSL não provisiona**
  - [ ] Verificar CAA records permitem Let's Encrypt
  - [ ] Remover CAA records restritivos
  - [ ] Aguardar 10-15min após DNS propagar

- [ ] **Se auth não funciona**
  - [ ] Verificar Supabase Redirect URLs incluem novo domínio
  - [ ] Limpar cookies e cache do navegador
  - [ ] Testar em janela anônima

---

## 📊 Monitoramento Contínuo

### Métricas Diárias

- [ ] **Usuários**
  - [ ] Novos sign-ups
  - [ ] Usuários ativos diários (DAU)
  - [ ] Taxa de retenção

- [ ] **Performance**
  - [ ] Tempo de resposta médio
  - [ ] Taxa de erro (< 1%)
  - [ ] Disponibilidade (uptime > 99.9%)

- [ ] **Dados**
  - [ ] Transações criadas (expenses, income)
  - [ ] Crescimento de dados no banco
  - [ ] Uso de storage

### Alertas Configurados

- [ ] **Críticos**
  - [ ] Application down (5xx errors)
  - [ ] Database connection failures
  - [ ] Spike de errors > 10/min

- [ ] **Warnings**
  - [ ] Slow queries > 5s
  - [ ] Edge Function timeouts
  - [ ] Webhook failures

- [ ] **Informacionais**
  - [ ] Deploy completado
  - [ ] Novo usuário registrado
  - [ ] Pagamento bem-sucedido

### Revisões Semanais

- [ ] **Segurança**
  - [ ] Revisar logs de autenticação
  - [ ] Verificar tentativas de acesso suspeitas
  - [ ] Atualizar dependências com vulnerabilidades

- [ ] **Performance**
  - [ ] Analisar queries lentas
  - [ ] Otimizar índices se necessário
  - [ ] Limpar dados antigos/desnecessários

- [ ] **Custos**
  - [ ] Revisar uso Lovable
  - [ ] Revisar uso Supabase (database, bandwidth, edge functions)
  - [ ] Revisar uso Stripe (transações)

### Backups e Disaster Recovery

- [ ] **Plano de backup**
  - [ ] Backups automáticos Supabase habilitados
  - [ ] Backup manual semanal realizado
  - [ ] Backup armazenado em local externo

- [ ] **Teste de restauração**
  - [ ] Restauração testada em ambiente de staging
  - [ ] Tempo de recovery documentado (RTO)
  - [ ] Procedimento de rollback documentado

- [ ] **Plan B**
  - [ ] Domínio secundário configurado (opcional)
  - [ ] Lovable staging URL sempre acessível
  - [ ] Contatos de emergência atualizados

---

## 📝 Documentação Final

- [ ] **README.md atualizado**
  - [ ] Instruções de setup
  - [ ] Variáveis de ambiente necessárias
  - [ ] Comandos úteis

- [ ] **ARCHITECTURE.md**
  - [ ] Diagrama de arquitetura
  - [ ] Fluxos de dados
  - [ ] Padrões de código

- [ ] **COMPLIANCE_REPORT.md**
  - [ ] Status de conformidade GDPR
  - [ ] Políticas RLS documentadas
  - [ ] Vulnerabilidades conhecidas e mitigações

- [ ] **Runbook operacional**
  - [ ] Como fazer deploy
  - [ ] Como fazer rollback
  - [ ] Como debugar problemas comuns
  - [ ] Contatos de suporte (Lovable, Supabase, Stripe)

---

## ✅ Checklist de Aprovação Final

Antes de anunciar o app como "em produção", confirme:

- [ ] ✅ Todos os itens de **Verificação** completos
- [ ] 🔒 Todos os itens de **Segurança** completos
- [ ] 🚀 Todos os itens de **Produção** completos
- [ ] 🌐 Domínio customizado funcionando (ou não aplicável)
- [ ] 📊 Monitoramento configurado e funcionando
- [ ] 📚 Documentação completa e atualizada
- [ ] 👥 Equipe treinada em procedimentos operacionais
- [ ] 🆘 Plano de disaster recovery testado

---

## 🎉 Pós-Deploy

**Parabéns!** 🎊 O GestFin está em produção!

### Próximos Passos

1. **Comunicar aos usuários**
   - Anunciar lançamento
   - Enviar onboarding emails
   - Oferecer suporte inicial

2. **Coletar feedback**
   - Configurar analytics (Google Analytics, Mixpanel, etc.)
   - Adicionar feedback widget
   - Monitorar tickets de suporte

3. **Iterar e melhorar**
   - Priorizar bugs reportados
   - Implementar features mais pedidas
   - Otimizar baseado em dados de uso

---

## 📞 Suporte

- **Lovable**: [docs.lovable.dev](https://docs.lovable.dev) | [Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs) | [Discord](https://discord.supabase.com)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs) | [Support](https://support.stripe.com)

---

**Desenvolvido com ❤️ para GestFin**

*Versão 1.0 - Janeiro 2025*
