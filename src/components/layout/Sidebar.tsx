import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Tags,
  CreditCard,
  Wallet,
  PiggyBank,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePayables } from '@/hooks/usePayables';

const menuItems = [
  { id: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: '/calendar', label: 'Calendário', icon: Calendar },
  { id: '/income', label: 'Receitas', icon: TrendingUp },
  { id: '/expenses', label: 'Despesas', icon: TrendingDown },
  { id: '/categories', label: 'Serviços', icon: Tags },
  { id: '/payables', label: 'Contas a Pagar', icon: CreditCard },
  { id: '/debts', label: 'Dívidas', icon: Wallet },
  { id: '/investments', label: 'Investimentos', icon: PiggyBank },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div className={cn(
        "hidden md:flex fixed left-0 top-[4rem] bottom-[3.5rem] z-30 flex-col bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto pt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full transition-all duration-200 hover-scale",
                    isActive && "bg-primary text-primary-foreground",
                    isCollapsed ? "justify-center px-2" : "justify-start"
                  )}
                  onClick={() => handleNavigation(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Toggle Button - positioned on the divider line */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "hidden md:flex fixed top-1/2 -translate-y-1/2 z-40 h-8 w-8 rounded-full border-2 bg-background shadow-md hover-scale transition-all duration-300",
          isCollapsed ? "left-[3.5rem]" : "left-[15.5rem]"
        )}
        title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </>
  );
}
