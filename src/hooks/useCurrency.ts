import { useState, useEffect } from 'react';

export type Currency = 'EUR' | 'BRL' | 'USD' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'CHF';

interface CurrencyConfig {
  code: Currency;
  symbol: string;
  locale: string;
  name: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    locale: 'pt-PT',
    name: 'Euro'
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    locale: 'pt-BR',
    name: 'Real Brasileiro'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    name: 'US Dollar'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    name: 'British Pound'
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    locale: 'en-CA',
    name: 'Canadian Dollar'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    locale: 'en-AU',
    name: 'Australian Dollar'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    locale: 'ja-JP',
    name: 'Japanese Yen'
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    locale: 'de-CH',
    name: 'Swiss Franc'
  }
};

const STORAGE_KEY = 'preferred-currency';

export const useCurrency = () => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Currency) || 'EUR'; // Default to Euro for Portugal
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const formatCurrency = (amount: number): string => {
    const config = CURRENCIES[currency];
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getCurrencySymbol = (): string => {
    return CURRENCIES[currency].symbol;
  };

  const getCurrencyName = (): string => {
    return CURRENCIES[currency].name;
  };

  return {
    currency,
    setCurrency,
    formatCurrency,
    getCurrencySymbol,
    getCurrencyName,
    currencies: CURRENCIES,
  };
};
