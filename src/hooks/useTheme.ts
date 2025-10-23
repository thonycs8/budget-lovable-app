import { useState, useEffect } from 'react';

export type ThemeTemplate = 'default' | 'uber' | 'ocean' | 'forest' | 'sunset';

interface ThemeColors {
  name: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  destructive: string;
}

const THEME_TEMPLATES: Record<ThemeTemplate, ThemeColors> = {
  default: {
    name: 'Padrão',
    primary: '222.2 47.4% 11.2%',
    primaryLight: '210 40% 96.1%',
    secondary: '210 40% 96.1%',
    accent: '210 40% 96.1%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    muted: '210 40% 96.1%',
    mutedForeground: '215.4 16.3% 46.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    border: '214.3 31.8% 91.4%',
    destructive: '0 84.2% 60.2%',
  },
  uber: {
    name: 'Uber',
    primary: '0 0% 0%',
    primaryLight: '0 0% 20%',
    secondary: '0 0% 96%',
    accent: '0 0% 10%',
    background: '0 0% 100%',
    foreground: '0 0% 0%',
    muted: '0 0% 96%',
    mutedForeground: '0 0% 45%',
    card: '0 0% 100%',
    cardForeground: '0 0% 0%',
    border: '0 0% 90%',
    destructive: '0 72% 51%',
  },
  ocean: {
    name: 'Oceano',
    primary: '199 89% 48%',
    primaryLight: '199 89% 60%',
    secondary: '197 71% 73%',
    accent: '201 96% 32%',
    background: '0 0% 100%',
    foreground: '200 89% 10%',
    muted: '197 71% 95%',
    mutedForeground: '199 20% 40%',
    card: '0 0% 100%',
    cardForeground: '200 89% 10%',
    border: '197 71% 85%',
    destructive: '0 84% 60%',
  },
  forest: {
    name: 'Floresta',
    primary: '142 76% 36%',
    primaryLight: '142 76% 50%',
    secondary: '142 71% 73%',
    accent: '142 90% 25%',
    background: '0 0% 100%',
    foreground: '142 76% 10%',
    muted: '142 71% 95%',
    mutedForeground: '142 20% 40%',
    card: '0 0% 100%',
    cardForeground: '142 76% 10%',
    border: '142 71% 85%',
    destructive: '0 84% 60%',
  },
  sunset: {
    name: 'Pôr do Sol',
    primary: '24 100% 50%',
    primaryLight: '24 100% 60%',
    secondary: '340 82% 52%',
    accent: '45 100% 51%',
    background: '0 0% 100%',
    foreground: '24 100% 10%',
    muted: '24 100% 95%',
    mutedForeground: '24 20% 40%',
    card: '0 0% 100%',
    cardForeground: '24 100% 10%',
    border: '24 100% 85%',
    destructive: '0 84% 60%',
  },
};

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeTemplate>(() => {
    const stored = localStorage.getItem('theme-template');
    return (stored as ThemeTemplate) || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    const colors = THEME_TEMPLATES[theme];

    // Apply light theme colors
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-light', colors.primaryLight);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card-foreground', colors.cardForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--destructive', colors.destructive);

    localStorage.setItem('theme-template', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeTemplate) => {
    setThemeState(newTheme);
  };

  const getThemeName = (template: ThemeTemplate) => {
    return THEME_TEMPLATES[template].name;
  };

  return { theme, setTheme, getThemeName, templates: Object.keys(THEME_TEMPLATES) as ThemeTemplate[] };
}
