import { useState } from 'react';
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
  Menu,
  X,
  Building2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'income', label: 'Receitas', icon: TrendingUp },
  { id: 'expenses', label: 'Despesas', icon: TrendingDown },
  { id: 'categories', label: 'Categorias', icon: Tags },
  { id: 'payables', label: 'Contas a Pagar', icon: CreditCard },
  { id: 'investments', label: 'Investimentos', icon: PiggyBank },
  { id: 'alerts', label: 'Alertas', icon: Bell },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { payables, selectedGroup, setSelectedGroup } = useApp();

  // Calculate overdue payables for alerts
  const overduePayables = payables.filter(p => {
    const dueDate = new Date(p.dueDate);
    const today = new Date();
    return !p.isPaid && dueDate < today && p.group === selectedGroup;
  });

  const handleNavigation = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  const toggleGroup = () => {
    setSelectedGroup(selectedGroup === 'empresa' ? 'familia' : 'empresa');
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 transform bg-card border-r transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              GestFin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestão Financeira
            </p>
            
            {/* Group selector */}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleGroup}
                className="w-full justify-start"
              >
                {selectedGroup === 'empresa' ? (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    Empresa
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Família
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showBadge = item.id === 'alerts' && overduePayables.length > 0;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
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

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              © 2025 GestFin
            </div>
          </div>
        </div>
      </div>
    </>
  );
}