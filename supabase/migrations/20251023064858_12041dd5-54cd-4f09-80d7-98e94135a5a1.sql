-- Create recurring_expenses table for automatic predictions
CREATE TABLE public.recurring_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  last_generated_date DATE,
  is_active BOOLEAN DEFAULT true,
  reminder_days_before INTEGER DEFAULT 3,
  auto_create BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expense_predictions table for ML-based predictions
CREATE TABLE public.expense_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  predicted_amount NUMERIC NOT NULL,
  predicted_date DATE NOT NULL,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
  prediction_source TEXT NOT NULL CHECK (prediction_source IN ('recurring', 'pattern', 'manual')),
  is_confirmed BOOLEAN DEFAULT false,
  confirmed_expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financial_reminders table
CREATE TABLE public.financial_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('expense', 'income', 'payable', 'investment', 'prediction')),
  related_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for recurring_expenses
CREATE POLICY "Users can view their own recurring expenses"
  ON public.recurring_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring expenses"
  ON public.recurring_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring expenses"
  ON public.recurring_expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring expenses"
  ON public.recurring_expenses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for expense_predictions
CREATE POLICY "Users can view their own predictions"
  ON public.expense_predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own predictions"
  ON public.expense_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions"
  ON public.expense_predictions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions"
  ON public.expense_predictions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for financial_reminders
CREATE POLICY "Users can view their own reminders"
  ON public.financial_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders"
  ON public.financial_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
  ON public.financial_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
  ON public.financial_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_recurring_expenses_user_id ON public.recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_frequency ON public.recurring_expenses(frequency, is_active);
CREATE INDEX idx_expense_predictions_user_id ON public.expense_predictions(user_id);
CREATE INDEX idx_expense_predictions_date ON public.expense_predictions(predicted_date);
CREATE INDEX idx_financial_reminders_user_id ON public.financial_reminders(user_id);
CREATE INDEX idx_financial_reminders_due_date ON public.financial_reminders(due_date, is_sent);

-- Trigger for updated_at on recurring_expenses
CREATE TRIGGER update_recurring_expenses_updated_at
  BEFORE UPDATE ON public.recurring_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on expense_predictions
CREATE TRIGGER update_expense_predictions_updated_at
  BEFORE UPDATE ON public.expense_predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on financial_reminders
CREATE TRIGGER update_financial_reminders_updated_at
  BEFORE UPDATE ON public.financial_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();