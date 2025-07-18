import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for financial data
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory: string;
  date: string;
  group: 'empresa' | 'familia';
}

export interface Payable {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  category: string;
  group: 'empresa' | 'familia';
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  subcategories: string[];
}

interface AppContextType {
  transactions: Transaction[];
  payables: Payable[];
  categories: Category[];
  selectedGroup: 'empresa' | 'familia';
  setTransactions: (transactions: Transaction[]) => void;
  setPayables: (payables: Payable[]) => void;
  setCategories: (categories: Category[]) => void;
  setSelectedGroup: (group: 'empresa' | 'familia') => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addPayable: (payable: Omit<Payable, 'id'>) => void;
  formatCurrency: (amount: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salário',
      amount: 5000,
      type: 'income',
      category: 'Trabalho',
      subcategory: 'Salário',
      date: '2025-01-15',
      group: 'familia'
    },
    {
      id: '2',
      description: 'Supermercado',
      amount: 350,
      type: 'expense',
      category: 'Alimentação',
      subcategory: 'Supermercado',
      date: '2025-01-16',
      group: 'familia'
    },
    {
      id: '3',
      description: 'Venda de Produto',
      amount: 2500,
      type: 'income',
      category: 'Vendas',
      subcategory: 'Produto A',
      date: '2025-01-17',
      group: 'empresa'
    }
  ]);

  const [payables, setPayables] = useState<Payable[]>([
    {
      id: '1',
      description: 'Conta de Luz',
      amount: 250,
      dueDate: '2025-01-25',
      isPaid: false,
      category: 'Utilidades',
      group: 'familia'
    },
    {
      id: '2',
      description: 'Aluguel Escritório',
      amount: 1200,
      dueDate: '2025-01-20',
      isPaid: false,
      category: 'Infraestrutura',
      group: 'empresa'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Trabalho',
      type: 'income',
      subcategories: ['Salário', 'Freelance', 'Bônus']
    },
    {
      id: '2',
      name: 'Vendas',
      type: 'income',
      subcategories: ['Produto A', 'Produto B', 'Serviços']
    },
    {
      id: '3',
      name: 'Alimentação',
      type: 'expense',
      subcategories: ['Supermercado', 'Restaurante', 'Delivery']
    },
    {
      id: '4',
      name: 'Utilidades',
      type: 'expense',
      subcategories: ['Luz', 'Água', 'Internet', 'Telefone']
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<'empresa' | 'familia'>('familia');

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addPayable = (payable: Omit<Payable, 'id'>) => {
    const newPayable: Payable = {
      ...payable,
      id: Date.now().toString()
    };
    setPayables(prev => [newPayable, ...prev]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        payables,
        categories,
        selectedGroup,
        setTransactions,
        setPayables,
        setCategories,
        setSelectedGroup,
        addTransaction,
        addPayable,
        formatCurrency
      }}
    >
      {children}
    </AppContext.Provider>
  );
};