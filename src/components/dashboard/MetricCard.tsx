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
    <Card className={cn("hover:shadow-lg transition-shadow", getVariantStyles(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={cn(
              "font-medium",
              trend.isPositive ? "text-income" : "text-expense"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            {' '}em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  );
}