import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'income' | 'expense' | 'investment';
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  variant = 'default'
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'income':
        return 'border-l-4 border-l-income bg-gradient-to-r from-income/5 to-transparent';
      case 'expense':
        return 'border-l-4 border-l-expense bg-gradient-to-r from-expense/5 to-transparent';
      case 'investment':
        return 'border-l-4 border-l-investment bg-gradient-to-r from-investment/5 to-transparent';
      default:
        return 'border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent';
    }
  };

  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4",
      getVariantStyles(), 
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="text-muted-foreground group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
          {value}
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn(
              "text-sm font-semibold px-2 py-0.5 rounded-full",
              trend.isPositive 
                ? "bg-income/10 text-income" 
                : "bg-expense/10 text-expense"
            )}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs. mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}