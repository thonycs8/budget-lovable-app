# 💰 GestFin - Sistema de Gestão Financeira

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.52.0-green.svg)

Uma aplicação moderna e completa para gestão financeira pessoal, desenvolvida com React, TypeScript e Supabase.

[🚀 Demo](https://lovable.dev/projects/c748d7f2-e855-47dc-b643-d3aff17568de) • [📖 Documentação](#documentação) • [🐛 Reportar Bug](https://github.com/seu-usuario/gestfin/issues)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Segurança](#-segurança)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**GestFin** é uma aplicação web completa para gestão financeira pessoal que permite aos usuários controlarem suas finanças de forma intuitiva e eficiente. Com uma interface moderna e responsiva, o sistema oferece controle total sobre receitas, despesas, investimentos e contas a pagar.

### Por que GestFin?

- ✅ **Interface Intuitiva**: Design moderno e fácil de usar
- ✅ **Segurança**: Autenticação robusta e proteção de dados
- ✅ **Multi-moeda**: Suporte para EUR, BRL e USD
- ✅ **Personalização**: Temas customizáveis e preferências regionais
- ✅ **Análises**: Gráficos e relatórios detalhados
- ✅ **Alertas**: Notificações de vencimentos e limites
- ✅ **Responsive**: Funciona perfeitamente em desktop e mobile

---

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral das finanças
- Gráficos interativos (Receitas vs Despesas)
- Métricas principais (saldo, receitas, despesas, investimentos)
- Estatísticas por categoria

### 💸 Gestão de Despesas
- Cadastro de despesas com categorias
- Visualização em lista com filtros
- Edição e exclusão de despesas
- Histórico completo
- Validação de dados com Zod

### 💰 Gestão de Receitas
- Registro de receitas
- Categorização de fontes de renda
- Acompanhamento mensal
- Relatórios detalhados

### 📈 Investimentos
- Controle de investimentos
- Tipos: Ações, Fundos, Tesouro Direto, Criptomoedas, Imóveis
- Acompanhamento de rentabilidade
- Valor atual vs valor inicial

### 📅 Contas a Pagar
- Gestão de contas e compromissos
- Status de pagamento (pago/pendente)
- Alertas de vencimento
- Organização por data de vencimento
- Marcação rápida de pagamento

### 🏷️ Categorias
- Criação de categorias personalizadas
- Cores customizáveis
- Organização de transações
- Estatísticas por categoria

### 🔔 Alertas
- Notificações de contas vencidas
- Alertas de orçamento
- Avisos de investimentos
- Resumos semanais

### 📆 Calendário
- Visualização de transações por data
- Contas a vencer
- Receitas e despesas agendadas
- Interface intuitiva com react-day-picker

### 👤 Perfil de Usuário
- Gerenciamento de dados pessoais
- Configurações de aparência (temas)
- Preferências regionais (moeda, idioma)
- Segurança da conta

### ⚙️ Configurações
- Notificações (email, push, lembretes)
- Preferências regionais
- Formato de data e números
- Alertas personalizados

### 🔐 Autenticação e Segurança
- Sistema de login/registro seguro
- Validação robusta com Zod
- Proteção contra ataques (XSS, CSRF)
- Row Level Security (RLS) no Supabase
- Senhas fortes (mínimo 8 caracteres, maiúsculas, números)
- Logs apenas em desenvolvimento (sem vazamento de dados)

### 🎨 Personalização
- Múltiplos temas de cores
- Modo claro/escuro
- Suporte a múltiplas moedas (EUR, BRL, USD)
- Formatação regional de números

### 📱 Integrações
- **Supabase**: Backend, autenticação e banco de dados
- **Stripe**: Processamento de pagamentos (em desenvolvimento)
- **React Query**: Cache e sincronização de dados

---

## 🛠️ Tecnologias

### Frontend
- **React 18.3.1** - Biblioteca JavaScript para UI
- **TypeScript 5.5.3** - Superset JavaScript com tipagem estática
- **Vite 5.4.1** - Build tool e dev server
- **React Router DOM 6.26.2** - Roteamento

### UI/UX
- **Tailwind CSS 3.4.11** - Framework CSS utility-first
- **shadcn/ui** - Componentes React reutilizáveis
- **Radix UI** - Componentes acessíveis e não estilizados
- **Lucide React** - Ícones modernos
- **Recharts 3.1.0** - Biblioteca de gráficos
- **date-fns 3.6.0** - Manipulação de datas
- **next-themes 0.3.0** - Sistema de temas

### Formulários e Validação
- **React Hook Form 7.53.0** - Gestão de formulários
- **Zod 3.23.8** - Schema validation
- **@hookform/resolvers 3.9.0** - Integração Zod + React Hook Form

### Backend e Database
- **Supabase 2.52.0** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions
- **@tanstack/react-query 5.56.2** - State management e cache

### Pagamentos
- **Stripe** - Processamento de pagamentos (integração configurada)

### Dev Tools
- **ESLint 9.9.0** - Linter JavaScript/TypeScript
- **PostCSS 8.4.47** - Processador CSS
- **Autoprefixer 10.4.20** - Prefixos CSS automáticos

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (vem com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Conta Supabase** ([Criar conta](https://supabase.com/))
- **Conta Stripe** (opcional, para pagamentos) ([Criar conta](https://stripe.com/))

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (veja [Configuração](#-configuração))

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica

# Stripe Configuration (Opcional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Configuração do Supabase

1. **Crie um projeto** no [Supabase](https://supabase.com/)

2. **Configure a autenticação**:
   - Vá em `Authentication` > `Providers`
   - Ative `Email` provider
   - Configure URLs de redirecionamento
   - Desative "Confirm email" para desenvolvimento (opcional)

3. **Execute as migrations**:
   - As migrations estão em `supabase/migrations/`
   - Elas criam as tabelas: `profiles`, `categories`, `expenses`, `income`, `investments`, `payables`, `user_settings`, `workouts`
   - Row Level Security (RLS) é aplicado automaticamente

4. **Obtenha as credenciais**:
   - URL: `Settings` > `API` > `Project URL`
   - Anon Key: `Settings` > `API` > `anon` public

### Configuração do Stripe (Opcional)

1. **Crie uma conta** no [Stripe](https://stripe.com/)
2. **Obtenha as chaves**:
   - `Dashboard` > `Developers` > `API keys`
   - Use as chaves de teste (test mode) para desenvolvimento
3. **Configure o webhook** (se necessário):
   - `Dashboard` > `Developers` > `Webhooks`

---

## 💻 Uso

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Build para desenvolvimento (com source maps)
npm run build:dev

# Preview da build de produção
npm run preview

# Lint do código
npm run lint
```

### Estrutura de Pastas

```
gestfin/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── dashboard/       # Componentes do dashboard
│   │   ├── forms/          # Formulários (Expense, Income, etc)
│   │   ├── layout/         # Layout (Header, Footer, Sidebar)
│   │   └── ui/             # Componentes UI do shadcn
│   ├── contexts/           # Context API (Auth)
│   ├── hooks/              # Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useCategories.ts
│   │   ├── useExpenses.ts
│   │   ├── useIncome.ts
│   │   ├── useInvestments.ts
│   │   ├── usePayables.ts
│   │   ├── useSettings.ts
│   │   ├── useCurrency.ts
│   │   └── useTheme.ts
│   ├── integrations/       # Integrações externas
│   │   └── supabase/       # Cliente e tipos Supabase
│   ├── lib/                # Utilidades
│   ├── pages/              # Páginas da aplicação
│   │   ├── About.tsx
│   │   ├── Alerts.tsx
│   │   ├── Auth.tsx
│   │   ├── Calendar.tsx
│   │   ├── Categories.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Expenses.tsx
│   │   ├── GDPR.tsx
│   │   ├── Help.tsx
│   │   ├── Income.tsx
│   │   ├── Investments.tsx
│   │   ├── NotFound.tsx
│   │   ├── Payables.tsx
│   │   ├── Privacy.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── Terms.tsx
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais
├── supabase/
│   ├── config.toml         # Configuração Supabase
│   └── migrations/         # Migrations do banco de dados
├── public/                 # Arquivos estáticos
├── .env                    # Variáveis de ambiente (não commitado)
├── package.json            # Dependências e scripts
├── tailwind.config.ts      # Configuração Tailwind
├── tsconfig.json           # Configuração TypeScript
└── vite.config.ts          # Configuração Vite
```

### Principais Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Dashboard | Visão geral das finanças |
| `/auth` | Auth | Login e registro |
| `/expenses` | Expenses | Gestão de despesas |
| `/income` | Income | Gestão de receitas |
| `/investments` | Investments | Controle de investimentos |
| `/payables` | Payables | Contas a pagar |
| `/categories` | Categories | Gerenciar categorias |
| `/calendar` | Calendar | Calendário financeiro |
| `/alerts` | Alerts | Alertas e notificações |
| `/profile` | Profile | Perfil do usuário |
| `/settings` | Settings | Configurações |
| `/about` | About | Sobre o projeto |
| `/help` | Help | Ajuda e suporte |
| `/privacy` | Privacy | Política de privacidade |
| `/terms` | Terms | Termos de uso |
| `/gdpr` | GDPR | Conformidade GDPR |

---

## 📁 Estrutura do Projeto

### Componentes Principais

#### Dashboard Components
- **MetricCard**: Cards com métricas financeiras
- **CategoryChart**: Gráficos de categorias

#### Form Components
- **ExpenseForm**: Formulário de despesas com validação Zod
- **IncomeForm**: Formulário de receitas
- **InvestmentForm**: Formulário de investimentos
- **PayableForm**: Formulário de contas a pagar
- **NewCategoryForm**: Formulário de categorias

#### Layout Components
- **Header**: Cabeçalho com navegação
- **Footer**: Rodapé da aplicação
- **Sidebar**: Menu lateral responsivo

### Custom Hooks

- **useAuth**: Gestão de autenticação (login, signup, logout)
- **useCategories**: CRUD de categorias
- **useExpenses**: CRUD de despesas
- **useIncome**: CRUD de receitas
- **useInvestments**: CRUD de investimentos
- **usePayables**: CRUD de contas a pagar
- **useSettings**: Configurações do usuário
- **useCurrency**: Gestão de moedas e formatação
- **useTheme**: Gestão de temas

### Contexts

- **AuthContext**: Contexto global de autenticação
  - Gerencia estado do usuário
  - Session persistence
  - Auto-refresh de tokens

---

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção otimizado |
| `npm run build:dev` | Build de desenvolvimento com source maps |
| `npm run preview` | Preview da build de produção |
| `npm run lint` | Executa ESLint no código |

---

## 🔒 Segurança

Este projeto implementa várias camadas de segurança:

### Autenticação
- ✅ Senhas fortes obrigatórias (8+ caracteres, maiúsculas, números)
- ✅ Validação de email com formato correto
- ✅ Session management com Supabase Auth
- ✅ Auto-refresh de tokens
- ✅ Logout seguro

### Validação de Dados
- ✅ Validação client-side com Zod
- ✅ Validação server-side via RLS policies
- ✅ Sanitização de inputs
- ✅ Proteção contra XSS
- ✅ Proteção contra SQL injection

### Database Security
- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Policies baseadas em `auth.uid()`
- ✅ SECURITY DEFINER functions com search_path fixo
- ✅ Foreign keys e constraints

### Privacy
- ✅ Logs apenas em ambiente de desenvolvimento
- ✅ Sem vazamento de informações sensíveis
- ✅ Conformidade com GDPR
- ✅ Política de privacidade implementada

### Best Practices
- ✅ Variáveis de ambiente para secrets
- ✅ HTTPS obrigatório em produção
- ✅ CSP (Content Security Policy) configurado
- ✅ Rate limiting no Supabase
- ✅ Input sanitization

---

## 🚀 Deploy

### Deploy com Lovable

1. Acesse o [projeto no Lovable](https://lovable.dev/projects/c748d7f2-e855-47dc-b643-d3aff17568de)
2. Clique em `Share` > `Publish`
3. Seu app será publicado automaticamente

### Deploy Manual

#### Vercel

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Build
npm run build

# Deploy pasta dist/
netlify deploy --prod --dir=dist
```

#### Outras Plataformas

O projeto pode ser hospedado em qualquer plataforma que suporte aplicações React:
- Vercel
- Netlify
- AWS Amplify
- Firebase Hosting
- GitHub Pages
- Heroku

### Configuração de Produção

**Importante**: Configure as variáveis de ambiente na plataforma de deploy:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### Domínio Customizado

Para conectar um domínio próprio:
1. No Lovable: `Project` > `Settings` > `Domains`
2. Clique em `Connect Domain`
3. Siga as instruções de configuração DNS

Mais detalhes: [Documentação de Custom Domain](https://docs.lovable.dev/tips-tricks/custom-domain)

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Diretrizes

- Siga os padrões de código do projeto
- Escreva testes quando aplicável
- Atualize a documentação se necessário
- Use commits semânticos (feat, fix, docs, style, refactor, test, chore)

### Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/gestfin/issues) descrevendo:
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (browser, OS, etc)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Autores

**Equipe GestFin**
- Desenvolvido com ❤️ usando [Lovable](https://lovable.dev)

---

## 🙏 Agradecimentos

- [React](https://react.dev/) - Biblioteca JavaScript
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Supabase](https://supabase.com/) - Backend as a Service
- [Stripe](https://stripe.com/) - Processamento de pagamentos
- [Lucide](https://lucide.dev/) - Ícones
- [Recharts](https://recharts.org/) - Biblioteca de gráficos
- [React Hook Form](https://react-hook-form.com/) - Gestão de formulários
- [Zod](https://zod.dev/) - Schema validation

---

## 📞 Suporte

- 📧 Email: support@gestfin.com
- 💬 Discord: [Comunidade GestFin](https://discord.gg/gestfin)
- 📚 Documentação: [docs.gestfin.com](https://docs.gestfin.com)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/gestfin/issues)

---

## 🔄 Changelog

### [1.0.0] - 2024-01-23

#### Adicionado
- Sistema completo de gestão financeira
- Autenticação com Supabase
- Dashboard com gráficos
- CRUD de despesas, receitas, investimentos e contas a pagar
- Sistema de categorias personalizadas
- Alertas e notificações
- Calendário financeiro
- Múltiplas moedas (EUR, BRL, USD)
- Temas personalizáveis
- Segurança robusta com validação Zod e RLS
- Integração com Stripe
- Páginas de privacidade e termos

---

<div align="center">

**Feito com ❤️ por [Lovable](https://lovable.dev)**

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
