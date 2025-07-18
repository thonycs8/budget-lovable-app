import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';

// Import other pages as we create them
const Income = () => <div className="p-6"><h1 className="text-2xl font-bold">Receitas</h1><p className="text-muted-foreground">Gestão de receitas em desenvolvimento...</p></div>;
const Expenses = () => <div className="p-6"><h1 className="text-2xl font-bold">Despesas</h1><p className="text-muted-foreground">Gestão de despesas em desenvolvimento...</p></div>;
const Categories = () => <div className="p-6"><h1 className="text-2xl font-bold">Categorias</h1><p className="text-muted-foreground">Gestão de categorias em desenvolvimento...</p></div>;
const Payables = () => <div className="p-6"><h1 className="text-2xl font-bold">Contas a Pagar</h1><p className="text-muted-foreground">Gestão de contas a pagar em desenvolvimento...</p></div>;
const Calendar = () => <div className="p-6"><h1 className="text-2xl font-bold">Calendário</h1><p className="text-muted-foreground">Calendário financeiro em desenvolvimento...</p></div>;
const Investments = () => <div className="p-6"><h1 className="text-2xl font-bold">Investimentos</h1><p className="text-muted-foreground">Gestão de investimentos em desenvolvimento...</p></div>;
const Alerts = () => <div className="p-6"><h1 className="text-2xl font-bold">Alertas</h1><p className="text-muted-foreground">Central de alertas em desenvolvimento...</p></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-muted-foreground">Configurações do sistema em desenvolvimento...</p></div>;

const pageComponents = {
  dashboard: Dashboard,
  calendar: Calendar,
  income: Income,
  expenses: Expenses,
  categories: Categories,
  payables: Payables,
  investments: Investments,
  alerts: Alerts,
  settings: Settings,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const ActiveComponent = pageComponents[activeTab as keyof typeof pageComponents] || Dashboard;

  return (
    <div className="min-h-screen w-full flex bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 md:ml-0 ml-0">
        <div className="p-6 pt-16 md:pt-6">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default Index;
