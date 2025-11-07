import { useState, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'es' | 'fr';

const STORAGE_KEY = 'preferred-language';

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
    es: string;
    fr: string;
  };
}

export const translations: Translations = {
  // Hero Section
  'hero.badge': {
    pt: 'Gestão Financeira Inteligente',
    en: 'Intelligent Financial Management',
    es: 'Gestión Financiera Inteligente',
    fr: 'Gestion Financière Intelligente'
  },
  'hero.title': {
    pt: 'Transforme sua gestão financeira',
    en: 'Transform your financial management',
    es: 'Transforma tu gestión financiera',
    fr: 'Transformez votre gestion financière'
  },
  'hero.subtitle': {
    pt: 'Controle total das suas finanças com análises inteligentes e visualizações em tempo real',
    en: 'Total control of your finances with smart analytics and real-time visualizations',
    es: 'Control total de tus finanzas con análisis inteligentes y visualizaciones en tiempo real',
    fr: 'Contrôle total de vos finances avec des analyses intelligentes et des visualisations en temps réel'
  },
  'hero.cta.primary': {
    pt: 'Começar Gratuitamente',
    en: 'Start Free',
    es: 'Comenzar Gratis',
    fr: 'Commencer Gratuitement'
  },
  'hero.cta.secondary': {
    pt: 'Ver Demonstração',
    en: 'See Demo',
    es: 'Ver Demostración',
    fr: 'Voir la Démo'
  },
  // Features
  'features.title': {
    pt: 'Funcionalidades Poderosas',
    en: 'Powerful Features',
    es: 'Funcionalidades Poderosas',
    fr: 'Fonctionnalités Puissantes'
  },
  'features.predictions.title': {
    pt: 'Análises Inteligentes',
    en: 'Smart Analytics',
    es: 'Análisis Inteligentes',
    fr: 'Analyses Intelligentes'
  },
  'features.predictions.desc': {
    pt: 'Visualize seus padrões de gastos e receitas com gráficos detalhados',
    en: 'Visualize your spending and income patterns with detailed charts',
    es: 'Visualiza tus patrones de gastos e ingresos con gráficos detallados',
    fr: 'Visualisez vos modèles de dépenses et revenus avec des graphiques détaillés'
  },
  'features.categories.title': {
    pt: 'Categorias Personalizadas',
    en: 'Custom Categories',
    es: 'Categorías Personalizadas',
    fr: 'Catégories Personnalisées'
  },
  'features.categories.desc': {
    pt: 'Organize suas despesas da forma que faz sentido para você',
    en: 'Organize your expenses the way that makes sense to you',
    es: 'Organiza tus gastos de la forma que tenga sentido para ti',
    fr: 'Organisez vos dépenses de la manière qui vous convient'
  },
  'features.alerts.title': {
    pt: 'Alertas Automáticos',
    en: 'Automatic Alerts',
    es: 'Alertas Automáticas',
    fr: 'Alertes Automatiques'
  },
  'features.alerts.desc': {
    pt: 'Receba notificações sobre contas a pagar e metas atingidas',
    en: 'Receive notifications about bills to pay and goals achieved',
    es: 'Recibe notificaciones sobre facturas a pagar y metas alcanzadas',
    fr: 'Recevez des notifications sur les factures à payer et les objectifs atteints'
  },
  'features.calendar.title': {
    pt: 'Calendário Preditivo',
    en: 'Predictive Calendar',
    es: 'Calendario Predictivo',
    fr: 'Calendrier Prédictif'
  },
  'features.calendar.desc': {
    pt: 'Visualize receitas e despesas futuras em um calendário intuitivo',
    en: 'View future income and expenses in an intuitive calendar',
    es: 'Visualiza ingresos y gastos futuros en un calendario intuitivo',
    fr: 'Visualisez les revenus et dépenses futurs dans un calendrier intuitif'
  },
  'features.investments.title': {
    pt: 'Gestão de Investimentos',
    en: 'Investment Management',
    es: 'Gestión de Inversiones',
    fr: 'Gestion des Investissements'
  },
  'features.investments.desc': {
    pt: 'Acompanhe o desempenho de suas aplicações financeiras',
    en: 'Track the performance of your financial investments',
    es: 'Rastrea el rendimiento de tus inversiones financieras',
    fr: 'Suivez la performance de vos investissements financiers'
  },
  'features.sync.title': {
    pt: 'Sincronização em Tempo Real',
    en: 'Real-Time Sync',
    es: 'Sincronización en Tiempo Real',
    fr: 'Synchronisation en Temps Réel'
  },
  'features.sync.desc': {
    pt: 'Acesse seus dados de qualquer dispositivo, sempre atualizados',
    en: 'Access your data from any device, always up to date',
    es: 'Accede a tus datos desde cualquier dispositivo, siempre actualizados',
    fr: 'Accédez à vos données depuis n\'importe quel appareil, toujours à jour'
  },
  // Pricing
  'pricing.title': {
    pt: 'Planos e Preços',
    en: 'Plans & Pricing',
    es: 'Planes y Precios',
    fr: 'Plans et Tarifs'
  },
  'pricing.free.title': {
    pt: 'Gratuito',
    en: 'Free',
    es: 'Gratis',
    fr: 'Gratuit'
  },
  'pricing.free.price': {
    pt: 'Grátis',
    en: 'Free',
    es: 'Gratis',
    fr: 'Gratuit'
  },
  'pricing.premium.title': {
    pt: 'Premium',
    en: 'Premium',
    es: 'Premium',
    fr: 'Premium'
  },
  'pricing.premium.price': {
    pt: '/mês',
    en: '/month',
    es: '/mes',
    fr: '/mois'
  },
  'pricing.feature.unlimited': {
    pt: 'Transações ilimitadas',
    en: 'Unlimited transactions',
    es: 'Transacciones ilimitadas',
    fr: 'Transactions illimitées'
  },
  'pricing.feature.categories': {
    pt: 'Categorias personalizadas',
    en: 'Custom categories',
    es: 'Categorías personalizadas',
    fr: 'Catégories personnalisées'
  },
  'pricing.feature.reports': {
    pt: 'Relatórios detalhados',
    en: 'Detailed reports',
    es: 'Informes detallados',
    fr: 'Rapports détaillés'
  },
  'pricing.feature.alerts': {
    pt: 'Alertas inteligentes',
    en: 'Smart alerts',
    es: 'Alertas inteligentes',
    fr: 'Alertes intelligentes'
  },
  'pricing.feature.export': {
    pt: 'Exportação de dados',
    en: 'Data export',
    es: 'Exportación de datos',
    fr: 'Export de données'
  },
  'pricing.cta.start': {
    pt: 'Começar',
    en: 'Get Started',
    es: 'Comenzar',
    fr: 'Commencer'
  },
  // Navigation
  'nav.features': {
    pt: 'Funcionalidades',
    en: 'Features',
    es: 'Funcionalidades',
    fr: 'Fonctionnalités'
  },
  'nav.pricing': {
    pt: 'Preços',
    en: 'Pricing',
    es: 'Precios',
    fr: 'Tarifs'
  },
  'nav.login': {
    pt: 'Entrar',
    en: 'Login',
    es: 'Iniciar Sesión',
    fr: 'Connexion'
  },
  'nav.signup': {
    pt: 'Criar Conta',
    en: 'Sign Up',
    es: 'Registrarse',
    fr: 'S\'inscrire'
  }
};

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['pt', 'en', 'es', 'fr'].includes(stored)) {
      return stored as Language;
    }
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    return (['pt', 'en', 'es', 'fr'].includes(browserLang) ? browserLang : 'pt') as Language;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return {
    language,
    setLanguage,
    t
  };
};
