import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Tags,
  CreditCard,
  PiggyBank,
  Calendar,
  Bell,
  Settings,
  User,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { usePayables } from '@/hooks/usePayables';

const menuItems = [
  { id: '/', label: 'Dashboard', icon: BarChart3 },
  { id: '/calendar', label: 'Calendário', icon: Calendar },
  { id: '/income', label: 'Receitas', icon: TrendingUp },
  { id: '/expenses', label: 'Despesas', icon: TrendingDown },
  { id: '/categories', label: 'Categorias', icon: Tags },
  { id: '/payables', label: 'Contas a Pagar', icon: CreditCard },
  { id: '/investments', label: 'Investimentos', icon: PiggyBank },
  { id: '/alerts', label: 'Alertas', icon: Bell },
  { id: '/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const { payables } = usePayables();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate overdue payables for alerts
  const overduePayables = payables.filter(p => {
    const dueDate = new Date(p.due_date);
    const today = new Date();
    return !p.is_paid && dueDate < today;
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="hidden md:flex fixed left-0 top-[4rem] bottom-[3.5rem] z-30 w-64 flex-col bg-card border-r transition-all duration-300">
      <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="pb-6 border-b">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              GestFin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestão Financeira
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              const showBadge = item.id === '/alerts' && overduePayables.length > 0;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200 hover-scale",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleNavigation(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                  {showBadge && (
                    <Badge variant="destructive" className="ml-auto">
                      {overduePayables.length}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="pt-4 mt-auto border-t space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center pt-2">
              © 2025 GestFin
            </div>
          </div>
        </div>
      </div>
  );
}