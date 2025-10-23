import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating predictions for user:', user.id);

    // Get recurring expenses
    const { data: recurring, error: recurringError } = await supabase
      .from('recurring_expenses')
      .select('*')
      .eq('is_active', true);

    if (recurringError) throw recurringError;

    const predictions = [];
    const today = new Date();
    
    // Generate predictions from recurring expenses for next 90 days
    for (const expense of recurring || []) {
      const startDate = new Date(expense.start_date);
      const endDate = expense.end_date ? new Date(expense.end_date) : null;
      
      let currentDate = new Date(startDate);
      const futureLimit = new Date();
      futureLimit.setDate(today.getDate() + 90);
      
      while (currentDate <= futureLimit && (!endDate || currentDate <= endDate)) {
        if (currentDate > today) {
          predictions.push({
            user_id: user.id,
            category_id: expense.category_id,
            predicted_amount: expense.amount,
            predicted_date: currentDate.toISOString().split('T')[0],
            confidence_score: 0.95,
            prediction_source: 'recurring',
            notes: `Gerada de: ${expense.title}`,
          });
        }
        
        // Calculate next occurrence based on frequency
        switch (expense.frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'biweekly':
            currentDate.setDate(currentDate.getDate() + 14);
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'quarterly':
            currentDate.setMonth(currentDate.getMonth() + 3);
            break;
          case 'yearly':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }
    }

    // Pattern-based predictions (analyze historical expenses)
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', new Date(today.getFullYear() - 1, today.getMonth(), 1).toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (expensesError) throw expensesError;

    // Group expenses by category and analyze patterns
    const categoryPatterns = new Map<string, { amounts: number[], dates: string[] }>();
    
    for (const expense of expenses || []) {
      if (!expense.category_id) continue;
      
      if (!categoryPatterns.has(expense.category_id)) {
        categoryPatterns.set(expense.category_id, { amounts: [], dates: [] });
      }
      
      const pattern = categoryPatterns.get(expense.category_id)!;
      pattern.amounts.push(Number(expense.amount));
      pattern.dates.push(expense.date);
    }

    // Generate pattern-based predictions
    for (const [categoryId, pattern] of categoryPatterns) {
      if (pattern.amounts.length < 3) continue; // Need at least 3 data points
      
      // Calculate average amount
      const avgAmount = pattern.amounts.reduce((a, b) => a + b, 0) / pattern.amounts.length;
      
      // Calculate average frequency (days between expenses)
      const dates = pattern.dates.map(d => new Date(d).getTime()).sort();
      const intervals = [];
      for (let i = 1; i < dates.length; i++) {
        intervals.push((dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24));
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      
      // Generate next prediction if pattern is consistent
      if (avgInterval > 0 && avgInterval < 90) {
        const lastDate = new Date(Math.max(...dates));
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + Math.round(avgInterval));
        
        if (nextDate > today && nextDate <= futureLimit) {
          predictions.push({
            user_id: user.id,
            category_id: categoryId,
            predicted_amount: Math.round(avgAmount * 100) / 100,
            predicted_date: nextDate.toISOString().split('T')[0],
            confidence_score: Math.min(0.85, pattern.amounts.length / 10),
            prediction_source: 'pattern',
            notes: `Baseado em ${pattern.amounts.length} transações anteriores`,
          });
        }
      }
    }

    // Delete old predictions
    await supabase
      .from('expense_predictions')
      .delete()
      .eq('user_id', user.id)
      .eq('is_confirmed', false);

    // Insert new predictions
    if (predictions.length > 0) {
      const { error: insertError } = await supabase
        .from('expense_predictions')
        .insert(predictions);

      if (insertError) throw insertError;
    }

    // Create reminders for predictions
    for (const pred of predictions) {
      const predDate = new Date(pred.predicted_date);
      const remindDate = new Date(predDate);
      remindDate.setDate(remindDate.getDate() - 3); // 3 days before
      
      if (remindDate > today) {
        await supabase
          .from('financial_reminders')
          .insert({
            user_id: user.id,
            reminder_type: 'prediction',
            title: 'Despesa Prevista',
            description: pred.notes,
            due_date: pred.predicted_date,
            remind_at: remindDate.toISOString(),
          });
      }
    }

    console.log(`Generated ${predictions.length} predictions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated: predictions.length,
        message: `${predictions.length} previsões geradas com sucesso`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating predictions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
