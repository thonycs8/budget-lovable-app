import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { days_ahead = 30 } = await req.json();

    console.log(`Generating balance predictions for user ${user.id} for ${days_ahead} days ahead`);

    // Fetch historical data (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0];

    const [expensesResult, incomeResult] = await Promise.all([
      supabase
        .from('expenses')
        .select('date, amount')
        .eq('user_id', user.id)
        .gte('date', ninetyDaysAgoStr)
        .order('date'),
      supabase
        .from('income')
        .select('date, amount')
        .eq('user_id', user.id)
        .gte('date', ninetyDaysAgoStr)
        .order('date')
    ]);

    if (expensesResult.error) throw expensesResult.error;
    if (incomeResult.error) throw incomeResult.error;

    const expenses = expensesResult.data || [];
    const income = incomeResult.data || [];

    // Group by date and calculate daily balance
    const dailyBalance = new Map<string, number>();
    
    // Process expenses
    expenses.forEach(exp => {
      const current = dailyBalance.get(exp.date) || 0;
      dailyBalance.set(exp.date, current - Number(exp.amount));
    });

    // Process income
    income.forEach(inc => {
      const current = dailyBalance.get(inc.date) || 0;
      dailyBalance.set(inc.date, current + Number(inc.amount));
    });

    // Sort dates and calculate cumulative balance
    const sortedDates = Array.from(dailyBalance.keys()).sort();
    const historicalData: { date: string; balance: number; dayIndex: number }[] = [];
    let cumulativeBalance = 0;
    
    sortedDates.forEach((date, index) => {
      cumulativeBalance += dailyBalance.get(date) || 0;
      historicalData.push({
        date,
        balance: cumulativeBalance,
        dayIndex: index
      });
    });

    if (historicalData.length < 7) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient historical data',
          message: 'Precisa de pelo menos 7 dias de dados históricos para gerar previsões'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Simple linear regression using least squares method
    const n = historicalData.length;
    const sumX = historicalData.reduce((sum, d) => sum + d.dayIndex, 0);
    const sumY = historicalData.reduce((sum, d) => sum + d.balance, 0);
    const sumXY = historicalData.reduce((sum, d) => sum + d.dayIndex * d.balance, 0);
    const sumX2 = historicalData.reduce((sum, d) => sum + d.dayIndex * d.dayIndex, 0);

    // Calculate slope (m) and intercept (b) for y = mx + b
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R² (coefficient of determination) for confidence
    const meanY = sumY / n;
    const totalSS = historicalData.reduce((sum, d) => sum + Math.pow(d.balance - meanY, 2), 0);
    const residualSS = historicalData.reduce((sum, d) => {
      const predicted = slope * d.dayIndex + intercept;
      return sum + Math.pow(d.balance - predicted, 2);
    }, 0);
    const rSquared = 1 - (residualSS / totalSS);
    const confidence = Math.max(0, Math.min(100, rSquared * 100)); // Convert to percentage

    console.log(`Linear regression: slope=${slope.toFixed(2)}, intercept=${intercept.toFixed(2)}, R²=${rSquared.toFixed(4)}`);

    // Generate predictions for the next N days
    const predictions: { date: string; predicted_balance: number; confidence: number }[] = [];
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const lastDayIndex = historicalData[historicalData.length - 1].dayIndex;
    const lastBalance = historicalData[historicalData.length - 1].balance;

    for (let i = 1; i <= days_ahead; i++) {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + i);
      
      const futureDayIndex = lastDayIndex + i;
      const predictedBalance = slope * futureDayIndex + intercept;
      
      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predicted_balance: Math.round(predictedBalance * 100) / 100,
        confidence: Math.round(confidence * 100) / 100
      });
    }

    console.log(`Generated ${predictions.length} balance predictions`);

    return new Response(
      JSON.stringify({
        predictions,
        model_stats: {
          slope: Math.round(slope * 100) / 100,
          intercept: Math.round(intercept * 100) / 100,
          r_squared: Math.round(rSquared * 10000) / 10000,
          confidence_score: Math.round(confidence * 100) / 100,
          data_points: n,
          current_balance: lastBalance
        },
        historical_data: historicalData.map(d => ({
          date: d.date,
          balance: Math.round(d.balance * 100) / 100
        }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in predict-balance function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
