# Calendário Financeiro Preditivo - Documentação Técnica

## Visão Geral

O Calendário Preditivo do GestFin é um sistema inteligente que combina transações confirmadas com previsões automáticas baseadas em padrões históricos e despesas recorrentes.

---

## Estrutura de Dados

### 1. Tabela `recurring_expenses`
Armazena despesas recorrentes configuradas pelo usuário.

```sql
CREATE TABLE public.recurring_expenses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  last_generated_date DATE,
  is_active BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 3,
  auto_create BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos principais:**
- `frequency`: Define a periodicidade (diária, semanal, quinzenal, mensal, trimestral, anual)
- `start_date` / `end_date`: Período de validade da recorrência
- `auto_create`: Se `true`, cria automaticamente despesas reais na data prevista
- `reminder_days_before`: Quantos dias antes enviar lembrete

---

### 2. Tabela `expense_predictions`
Armazena previsões geradas automaticamente.

```sql
CREATE TABLE public.expense_predictions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES categories(id),
  predicted_amount NUMERIC NOT NULL,
  predicted_date DATE NOT NULL,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
  prediction_source TEXT CHECK (prediction_source IN ('recurring', 'pattern', 'manual')),
  is_confirmed BOOLEAN DEFAULT false,
  confirmed_expense_id UUID REFERENCES expenses(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos principais:**
- `prediction_source`:
  - `recurring`: Gerada de despesa recorrente
  - `pattern`: Baseada em análise de padrões históricos
  - `manual`: Criada manualmente pelo usuário
- `confidence_score`: Score de 0 a 1 indicando confiabilidade (0.95 para recorrentes, 0.85 para padrões)
- `is_confirmed`: Se já foi convertida em despesa real

---

### 3. Tabela `financial_reminders`
Sistema de lembretes automáticos.

```sql
CREATE TABLE public.financial_reminders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('expense', 'income', 'payable', 'investment', 'prediction')),
  related_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## Lógica de Previsão

### Edge Function: `generate-predictions`

Localização: `supabase/functions/generate-predictions/index.ts`

#### Fluxo de Execução:

```
1. Buscar despesas recorrentes ativas
   ↓
2. Para cada recorrência, gerar previsões para próximos 90 dias
   ↓
3. Analisar histórico de despesas (últimos 12 meses)
   ↓
4. Agrupar por categoria e calcular padrões
   ↓
5. Para categorias com ≥3 transações:
   - Calcular valor médio
   - Calcular intervalo médio entre transações
   ↓
6. Gerar previsões baseadas em padrões
   ↓
7. Deletar previsões antigas não confirmadas
   ↓
8. Inserir novas previsões
   ↓
9. Criar lembretes automáticos (3 dias antes)
```

#### Algoritmo de Detecção de Padrões:

```javascript
// 1. Agrupa despesas por categoria
categoryPatterns = Map<categoryId, { amounts: [], dates: [] }>

// 2. Para cada categoria:
avgAmount = sum(amounts) / count(amounts)
intervals = dates.map((d, i) => d - dates[i-1]) // dias entre transações
avgInterval = sum(intervals) / count(intervals)

// 3. Se avgInterval entre 1 e 90 dias:
nextDate = lastDate + avgInterval
confidenceScore = min(0.85, transactionCount / 10)

// 4. Cria previsão se:
- nextDate está no futuro
- nextDate dentro de 90 dias
- Padrão é consistente (avgInterval > 0)
```

---

## Componentes React

### 1. `useRecurringExpenses` Hook
**Localização:** `src/hooks/useRecurringExpenses.ts`

```typescript
const {
  recurringExpenses,
  loading,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  refetch
} = useRecurringExpenses();
```

**Funcionalidades:**
- Fetch automático ao montar
- CRUD completo com RLS
- Notificações toast
- Sincronização otimista

---

### 2. `usePredictions` Hook
**Localização:** `src/hooks/usePredictions.ts`

```typescript
const {
  predictions,
  loading,
  generatePredictions,  // Chama edge function
  confirmPrediction,    // Marca previsão como confirmada
  deletePrediction,
  refetch
} = usePredictions();
```

---

### 3. `useReminders` Hook
**Localização:** `src/hooks/useReminders.ts`

```typescript
const {
  reminders,
  loading,
  dismissReminder,
  getActiveReminders,  // Filtra lembretes vencidos
  refetch
} = useReminders();
```

**Auto-refresh:** Atualiza a cada 60 segundos

---

### 4. `PredictiveCalendar` Component
**Localização:** `src/components/calendar/PredictiveCalendar.tsx`

Componente principal que integra:
- Calendário visual com estados coloridos
- Listagem de eventos por data
- Filtros (Todos, Confirmados, Previsões)
- Resumo de previsões (30 dias)
- Lembretes ativos

**Estados visuais:**
- 🟢 Verde: Receitas confirmadas
- 🔴 Vermelho: Despesas confirmadas
- 🟠 Laranja: Previsões
- ⚠️ Vermelho escuro pulsante: Contas em atraso

---

### 5. `RecurringExpenseForm` Component
**Localização:** `src/components/forms/RecurringExpenseForm.tsx`

Formulário completo para criar despesas recorrentes:
- Título, valor, categoria
- Frequência (6 opções)
- Data início/fim (DatePicker)
- Dias de antecedência para lembrete
- Toggle auto-criação

---

## Fluxos de Uso

### Fluxo 1: Criar Despesa Recorrente

```
Usuário → "Nova Despesa Recorrente"
  ↓
Preenche formulário (aluguel, R$ 1.500, mensal)
  ↓
createRecurringExpense()
  ↓
Salva no banco com RLS
  ↓
Estado atualizado automaticamente
```

---

### Fluxo 2: Gerar Previsões Automáticas

```
Usuário → Clica "Gerar Previsões"
  ↓
generatePredictions() chama edge function
  ↓
Edge function:
  1. Processa recorrências → 30 previsões
  2. Analisa padrões → 15 previsões
  3. Cria 45 lembretes
  ↓
Retorna: "45 previsões geradas"
  ↓
UI atualiza calendário automaticamente
```

---

### Fluxo 3: Confirmar Previsão

```
Usuário vê previsão no calendário
  ↓
Converte em despesa real (ExpenseForm)
  ↓
confirmPrediction(predictionId, expenseId)
  ↓
Marca is_confirmed = true
  ↓
Previsão some, despesa real aparece
```

---

### Fluxo 4: Sistema de Lembretes

```
Cron Job (diário, 8h) ou Manual
  ↓
Busca lembretes com remind_at <= now()
  ↓
Para cada lembrete não enviado:
  - Envia notificação push/email
  - Marca is_sent = true
  ↓
Usuário vê badge de lembretes ativos
  ↓
Pode dispensar individualmente
```

---

## Métricas e Analytics

### Dados coletados automaticamente:

1. **Acurácia das Previsões**
```sql
SELECT 
  prediction_source,
  COUNT(*) as total,
  SUM(CASE WHEN is_confirmed THEN 1 ELSE 0 END) as confirmed,
  AVG(confidence_score) as avg_confidence
FROM expense_predictions
GROUP BY prediction_source;
```

2. **Despesas Recorrentes Mais Comuns**
```sql
SELECT 
  frequency,
  COUNT(*) as count,
  AVG(amount) as avg_amount
FROM recurring_expenses
WHERE is_active = true
GROUP BY frequency
ORDER BY count DESC;
```

3. **Taxa de Confirmação por Categoria**
```sql
SELECT 
  c.name,
  COUNT(ep.id) as predictions,
  SUM(CASE WHEN ep.is_confirmed THEN 1 ELSE 0 END) as confirmed,
  ROUND(100.0 * SUM(CASE WHEN ep.is_confirmed THEN 1 ELSE 0 END) / COUNT(ep.id), 2) as accuracy_pct
FROM expense_predictions ep
JOIN categories c ON c.id = ep.category_id
GROUP BY c.name
ORDER BY accuracy_pct DESC;
```

---

## Otimizações de Performance

### Índices Criados:
```sql
CREATE INDEX idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_frequency ON recurring_expenses(frequency, is_active);
CREATE INDEX idx_expense_predictions_user_id ON expense_predictions(user_id);
CREATE INDEX idx_expense_predictions_date ON expense_predictions(predicted_date);
CREATE INDEX idx_financial_reminders_due_date ON financial_reminders(due_date, is_sent);
```

### Estratégias:
1. **Lazy Loading**: Previsões carregadas apenas ao abrir calendário
2. **Memoization**: `useMemo` para cálculos de eventos por data
3. **Batch Operations**: Edge function processa todas previsões de uma vez
4. **Incremental Updates**: Apenas atualiza linhas modificadas

---

## Segurança (RLS)

Todas as tabelas possuem Row Level Security (RLS):

```sql
-- Exemplo para recurring_expenses
CREATE POLICY "Users can view their own recurring expenses"
  ON recurring_expenses FOR SELECT
  USING (auth.uid() = user_id);

-- Idem para INSERT, UPDATE, DELETE
```

**Resultado:** Usuários só veem/modificam seus próprios dados.

---

## Próximas Melhorias

### Fase 2: Machine Learning
- [ ] Modelo de regressão para valores variáveis (ex: energia)
- [ ] Detecção de anomalias (gastos fora do padrão)
- [ ] Previsão de crescimento/redução de categorias

### Fase 3: Notificações
- [ ] Push notifications via PWA
- [ ] Email digest semanal
- [ ] WhatsApp (via Twilio)
- [ ] Telegram Bot

### Fase 4: Integrações
- [ ] Import OFX/CSV de bancos
- [ ] Sincronização com Open Banking
- [ ] API REST para apps externos

---

## Troubleshooting

### Previsões não aparecem:
1. Verificar se `generatePredictions()` foi chamado
2. Conferir logs da edge function
3. Validar se há dados históricos suficientes (≥3 transações)

### Lembretes não funcionam:
1. Verificar `remind_at` no banco
2. Confirmar que `is_sent = false`
3. Checar se sistema de notificações está ativo

### Performance lenta:
1. Verificar índices no banco
2. Limitar período de busca (exemplo: 90 dias)
3. Paginar resultados se >100 eventos

---

## Referências Técnicas

- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **React Query**: https://tanstack.com/query/latest
- **date-fns**: https://date-fns.org/
- **Recharts**: https://recharts.org/

---

## Contato e Suporte

Para dúvidas ou melhorias, consulte:
- Documentação principal: `ARCHITECTURE.md`
- Compliance: `COMPLIANCE_REPORT.md`
- Deploy checklist: `POST_DEPLOY_CHECKLIST.md`
