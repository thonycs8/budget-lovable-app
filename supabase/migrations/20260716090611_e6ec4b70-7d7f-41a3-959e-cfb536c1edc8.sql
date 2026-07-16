
-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========================
-- profiles
-- =========================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text, email text, phone text, avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- categories
-- =========================
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL, description text,
  color text DEFAULT '#3B82F6',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_own" ON public.categories FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- income
-- =========================
CREATE TABLE public.income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.income TO authenticated;
GRANT ALL ON public.income TO service_role;
ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "income_own" ON public.income FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_income_updated BEFORE UPDATE ON public.income
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- expenses
-- =========================
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expenses_own" ON public.expenses FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- payables
-- =========================
CREATE TABLE public.payables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL,
  description text,
  due_date date NOT NULL,
  is_paid boolean DEFAULT false,
  paid_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payables TO authenticated;
GRANT ALL ON public.payables TO service_role;
ALTER TABLE public.payables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payables_own" ON public.payables FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_payables_updated BEFORE UPDATE ON public.payables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- investments
-- =========================
CREATE TABLE public.investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  amount numeric(12,2) NOT NULL,
  current_value numeric(12,2),
  investment_type text NOT NULL,
  description text,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investments TO authenticated;
GRANT ALL ON public.investments TO service_role;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "investments_own" ON public.investments FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_investments_updated BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- debts
-- =========================
CREATE TABLE public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  total_amount numeric(15,2) NOT NULL,
  remaining_amount numeric(15,2) NOT NULL,
  interest_rate numeric(5,2) NOT NULL DEFAULT 0,
  monthly_payment numeric(15,2) NOT NULL,
  start_date date NOT NULL,
  end_date date,
  category text NOT NULL CHECK (category IN ('personal_loan','mortgage','car_loan','credit_card','other')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paid','overdue')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.debts REPLICA IDENTITY FULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debts TO authenticated;
GRANT ALL ON public.debts TO service_role;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "debts_own" ON public.debts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_debts_updated BEFORE UPDATE ON public.debts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- recurring_expenses
-- =========================
CREATE TABLE public.recurring_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  amount numeric NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('daily','weekly','biweekly','monthly','quarterly','yearly')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  last_generated_date date,
  is_active boolean DEFAULT true,
  reminder_days_before integer DEFAULT 3,
  auto_create boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recurring_expenses TO authenticated;
GRANT ALL ON public.recurring_expenses TO service_role;
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recurring_own" ON public.recurring_expenses FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_recurring_updated BEFORE UPDATE ON public.recurring_expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- expense_predictions
-- =========================
CREATE TABLE public.expense_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  predicted_amount numeric NOT NULL,
  predicted_date date NOT NULL,
  confidence_score numeric CHECK (confidence_score >= 0 AND confidence_score <= 1),
  prediction_source text NOT NULL CHECK (prediction_source IN ('recurring','pattern','manual')),
  is_confirmed boolean DEFAULT false,
  confirmed_expense_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_predictions TO authenticated;
GRANT ALL ON public.expense_predictions TO service_role;
ALTER TABLE public.expense_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "predictions_own" ON public.expense_predictions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_predictions_updated BEFORE UPDATE ON public.expense_predictions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- financial_reminders
-- =========================
CREATE TABLE public.financial_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('expense','income','payable','investment','prediction')),
  related_id uuid,
  title text NOT NULL,
  description text,
  due_date date NOT NULL,
  remind_at timestamptz NOT NULL,
  is_sent boolean DEFAULT false,
  is_dismissed boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_reminders TO authenticated;
GRANT ALL ON public.financial_reminders TO service_role;
ALTER TABLE public.financial_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reminders_own" ON public.financial_reminders FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_reminders_updated BEFORE UPDATE ON public.financial_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- user_settings
-- =========================
CREATE TABLE public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  payment_reminders boolean DEFAULT true,
  weekly_summary boolean DEFAULT true,
  language text DEFAULT 'pt',
  date_format text DEFAULT 'DD/MM/YYYY',
  number_format text DEFAULT 'european',
  budget_alerts boolean DEFAULT true,
  investment_alerts boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_own" ON public.user_settings FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.income REPLICA IDENTITY FULL;
ALTER TABLE public.expenses REPLICA IDENTITY FULL;
ALTER TABLE public.payables REPLICA IDENTITY FULL;
ALTER TABLE public.investments REPLICA IDENTITY FULL;
ALTER TABLE public.recurring_expenses REPLICA IDENTITY FULL;
ALTER TABLE public.expense_predictions REPLICA IDENTITY FULL;
ALTER TABLE public.financial_reminders REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE
  public.profiles, public.categories, public.income, public.expenses,
  public.payables, public.investments, public.debts,
  public.recurring_expenses, public.expense_predictions,
  public.financial_reminders, public.user_settings;
