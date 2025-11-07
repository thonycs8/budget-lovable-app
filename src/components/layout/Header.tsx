import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { usePayables } from '@/hooks/usePayables';
import { User, LogOut, Home, Menu, BarChart3, TrendingUp, TrendingDown, Tags, CreditCard, PiggyBank, Calendar, Bell, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExpenseForm from '@/components/forms/ExpenseForm';
import IncomeForm from '@/components/forms/IncomeForm';
import NewCategoryForm from '@/components/forms/NewCategoryForm';
import { PayableForm } from '@/components/forms/PayableForm';
import InvestmentForm from '@/components/forms/InvestmentForm';

const menuItems = [
  { id: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: '/calendar', label: 'Calendário', icon: Calendar },
  { id: '/income', label: 'Receitas', icon: TrendingUp },
  { id: '/expenses', label: 'Despesas', icon: TrendingDown },
  { id: '/categories', label: 'Categorias', icon: Tags },
  { id: '/payables', label: 'Contas a Pagar', icon: CreditCard },
  { id: '/investments', label: 'Investimentos', icon: PiggyBank },
  { id: '/alerts', label: 'Alertas', icon: Bell },
  { id: '/settings', label: 'Configurações', icon: Settings },
];

type DialogType = 'expense' | 'income' | 'category' | 'payable' | 'investment' | null;

export function Header() {
  const { user, signOut } = useAuth();
  const { payables } = usePayables();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  // Calculate overdue payables
  const overduePayables = payables.filter(p => {
    const dueDate = new Date(p.due_date);
    const today = new Date();
    return !p.is_paid && dueDate < today;
  });

  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleDialogSuccess = () => {
    setActiveDialog(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover-scale">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-background animate-slide-in-right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-lg font-bold">G</span>
                  </div>
                  gest-first
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start transition-all duration-200 hover-scale",
                        window.location.pathname === item.id && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleNavigation(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>

            {/* Logo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover-scale transition-all duration-200"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <span className="text-lg font-bold">G</span>
              </div>
              <span className="hidden font-semibold lg:inline-block">gest-first</span>
            </Button>

            {/* Desktop Navigation Menu */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover-scale">Financeiro</NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => navigate('/income')}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                              location.pathname === '/income' && "bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Receitas</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gerencie suas fontes de renda
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => navigate('/expenses')}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                              location.pathname === '/expenses' && "bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Despesas</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Controle seus gastos
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => navigate('/payables')}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                              location.pathname === '/payables' && "bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Contas a Pagar</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Acompanhe seus compromissos
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => navigate('/investments')}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
                              location.pathname === '/investments' && "bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <PiggyBank className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Investimentos</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Gerencie seu patrimônio
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover-scale">Adicionar</NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => setActiveDialog('income')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Nova Receita</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Registrar nova entrada
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => setActiveDialog('expense')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Nova Despesa</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Registrar novo gasto
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => setActiveDialog('payable')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Nova Conta</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Adicionar conta a pagar
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => setActiveDialog('investment')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Novo Investimento</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Registrar investimento
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            onClick={() => setActiveDialog('category')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">Nova Categoria</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Criar nova categoria
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => navigate('/calendar')}
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover-scale",
                      location.pathname === '/calendar' && "bg-accent"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendário
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => navigate('/alerts')}
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover-scale relative",
                      location.pathname === '/alerts' && "bg-accent"
                    )}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Alertas
                    {overduePayables.length > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                        {overduePayables.length}
                      </Badge>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    onClick={() => navigate('/settings')}
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer hover-scale",
                      location.pathname === '/settings' && "bg-accent"
                    )}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-scale transition-all duration-200">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background animate-scale-in" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')} className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                <span>Início</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Dialogs for quick actions */}
      <ExpenseForm 
        isOpen={activeDialog === 'expense'} 
        onClose={() => setActiveDialog(null)} 
      />

      <IncomeForm 
        isOpen={activeDialog === 'income'} 
        onClose={() => setActiveDialog(null)} 
      />

      <NewCategoryForm 
        isOpen={activeDialog === 'category'} 
        onClose={() => setActiveDialog(null)} 
      />

      <Dialog open={activeDialog === 'payable'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-background animate-scale-in max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Conta a Pagar</DialogTitle>
          </DialogHeader>
          <PayableForm onSuccess={() => setActiveDialog(null)} />
        </DialogContent>
      </Dialog>

      <InvestmentForm 
        isOpen={activeDialog === 'investment'} 
        onClose={() => setActiveDialog(null)} 
      />
    </>
  );
}
