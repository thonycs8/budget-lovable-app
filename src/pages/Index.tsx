import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Button } from '@/components/ui/button';

// Import pages
import Income from './Income';
import Expenses from './Expenses';
import Categories from './Categories';
import Calendar from './Calendar';
import Payables from './Payables';
import Investments from './Investments';
import Alerts from './Alerts';
import Settings from './Settings';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Acesso Necessário</h1>
          <p className="text-muted-foreground">
            Você precisa estar logado para acessar esta página.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }
  
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
