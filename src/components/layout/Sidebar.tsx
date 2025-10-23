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
  LogOut,
  ChevronLeft,
  ChevronRight
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

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
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
              const showBadge = item.id === '/alerts' && overduePayables.length > 0;

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
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {showBadge && (
                        <Badge variant="destructive" className="ml-auto">
                          {overduePayables.length}
                        </Badge>
                      )}
                    </>
                  )}
                  {isCollapsed && showBadge && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-2 mt-auto border-t space-y-2">
            {!isCollapsed && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 mb-2">
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
            )}
            
            {isCollapsed ? (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full"
                  onClick={() => navigate('/profile')}
                  title="Perfil"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full"
                  onClick={signOut}
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
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
            )}
          </div>
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
