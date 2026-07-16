import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhoneInput } from '@/components/ui/phone-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useCurrency, CURRENCIES, type Currency } from '@/hooks/useCurrency';
import { useTheme, type ThemeTemplate } from '@/hooks/useTheme';
import { User, Mail, Save, Globe, Palette, Phone } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().trim().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { currency, setCurrency, getCurrencyName, formatCurrency } = useCurrency();
  const { theme, setTheme, getThemeName, templates } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
    },
  });

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    toast({
      title: 'Moeda atualizada',
      description: `Moeda alterada para ${CURRENCIES[newCurrency].name}`,
    });
  };

  const handleThemeChange = (newTheme: ThemeTemplate) => {
    setTheme(newTheme);
    toast({
      title: 'Tema atualizado',
      description: `Tema alterado para ${getThemeName(newTheme)}`,
    });
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        form.reset({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || '',
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar perfil:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileFormData) => {
    setSaving(true);

    try {
      const profileData: any = {
        user_id: user?.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
      };

      // Include id if profile already exists
      if (profile?.id) {
        profileData.id = profile.id;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });

      fetchProfile();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao atualizar perfil:', error);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="flex-1 w-full">
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {form.watch('full_name') ? form.watch('full_name').charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Selecione o país e digite o número de telefone
                    </p>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </Form>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <Palette className="h-5 w-5" />
                Aparência
              </h3>
              <div className="space-y-2">
                <FormLabel htmlFor="theme">Tema de Cores</FormLabel>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme">
                    <SelectValue>
                      {getThemeName(theme)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {templates.map((template) => (
                      <SelectItem key={template} value={template}>
                        {getThemeName(template)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Escolha o tema de cores que mais combina com você
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5" />
                Preferências Regionais
              </h3>
              <div className="space-y-2">
                <FormLabel htmlFor="currency">Moeda</FormLabel>
                <Select value={currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger id="currency">
                    <SelectValue>
                      {CURRENCIES[currency].symbol} {CURRENCIES[currency].name}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="EUR">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">€</span>
                        <span>Euro (EUR)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="BRL">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">R$</span>
                        <span>Real Brasileiro (BRL)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="USD">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">$</span>
                        <span>Dólar Americano (USD)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Todos os valores serão exibidos em {getCurrencyName()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Exemplo: {formatCurrency(1234.56)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="font-medium">Configurações da Conta</h3>
            <Button 
              variant="outline" 
              onClick={signOut}
              className="w-full"
            >
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
