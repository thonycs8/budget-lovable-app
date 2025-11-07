# Configuração do Google AdSense no gest-first

## 📋 Visão Geral

O gest-first está configurado para exibir anúncios do Google AdSense para usuários do plano gratuito. Usuários premium (€2,99/mês) não verão anúncios.

## 🎯 Tipos de Anúncios Implementados

### 1. **Banner Ads (Anúncios de Banner)**
- Localizados nas páginas principais (Dashboard, Despesas, Receitas)
- Formato horizontal/responsivo
- Aparecem entre o conteúdo das páginas

### 2. **Video Ads (Anúncios em Vídeo)**
- Anúncios intersticiais (fullscreen)
- Aparecem após 30 segundos de uso
- Usuário pode fechar após 5 segundos
- Similar aos anúncios de apps móveis

## 🚀 Como Configurar o AdSense

### Passo 1: Criar Conta no Google AdSense

1. Acesse [https://www.google.com/adsense/](https://www.google.com/adsense/)
2. Faça login com sua conta Google
3. Inscreva-se no programa AdSense
4. Preencha as informações da sua empresa/site
5. Aguarde aprovação (pode levar alguns dias)

### Passo 2: Obter seu ID de Publicador

Após aprovação, você receberá um ID de publicador no formato:
```
ca-pub-XXXXXXXXXXXXXXXX
```

### Passo 3: Criar Unidades de Anúncio

No painel do AdSense:

1. Vá em **Anúncios** → **Unidades de anúncio**
2. Clique em **Criar unidade de anúncio**

#### Para Banners:
- **Nome**: gest-first Dashboard Banner
- **Tipo**: Display Ad (Banner)
- **Tamanho**: Responsivo
- Copie o **data-ad-slot** gerado

#### Para Vídeos:
- **Nome**: gest-first Video Ad
- **Tipo**: In-feed ou In-article
- **Formato**: Auto
- Copie o **data-ad-slot** gerado

### Passo 4: Atualizar o Código

Você precisa substituir os placeholders em 4 arquivos:

#### 1. **index.html** (linha 11)
```html
<!-- ANTES -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>

<!-- DEPOIS -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-SEU_ID_AQUI" crossorigin="anonymous"></script>
```

#### 2. **src/components/ads/AdBanner.tsx** (linha 29)
```typescript
// ANTES
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"

// DEPOIS
data-ad-client="ca-pub-SEU_ID_AQUI"
```

#### 3. **src/components/ads/AdVideo.tsx** (linha 52 e 55)
```typescript
// ANTES
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="YYYYYYYYYY"

// DEPOIS
data-ad-client="ca-pub-SEU_ID_AQUI"
data-ad-slot="SEU_SLOT_VIDEO_AQUI"
```

#### 4. **Atualizar slots nas páginas**

**src/pages/Dashboard.tsx** (linha 200):
```typescript
<AdBanner slot="SEU_SLOT_DASHBOARD" format="horizontal" />
```

**src/pages/Expenses.tsx** (linha 90):
```typescript
<AdBanner slot="SEU_SLOT_EXPENSES" format="horizontal" />
```

**src/pages/Income.tsx** (linha 89):
```typescript
<AdBanner slot="SEU_SLOT_INCOME" format="horizontal" />
```

## 🎨 Posicionamento dos Anúncios

### Dashboard
- **Localização**: Entre os gráficos e resumos financeiros
- **Formato**: Banner horizontal responsivo
- **Slot ID**: Dashboard Banner

### Despesas
- **Localização**: Antes da seção de filtros
- **Formato**: Banner horizontal responsivo
- **Slot ID**: Expenses Banner

### Receitas
- **Localização**: Antes da seção de filtros
- **Formato**: Banner horizontal responsivo
- **Slot ID**: Income Banner

## 🔐 Controle Premium

O sistema verifica automaticamente se o usuário é premium através do hook `usePremium()`:

```typescript
// src/hooks/usePremium.ts
export function usePremium() {
  const { isPremium, loading } = usePremium();
  
  // Se isPremium = true, anúncios NÃO aparecem
  // Se isPremium = false, anúncios aparecem
}
```

### Para Testar:

**Testar Anúncios (usuário free):**
```typescript
// Mantenha como está
setIsPremium(false);
```

**Testar sem Anúncios (usuário premium):**
```typescript
// Altere temporariamente para true
setIsPremium(true);
```

## 📊 Verificação de Funcionamento

### No Modo de Desenvolvimento:
Os anúncios podem não aparecer ou aparecer como espaços em branco. Isso é normal. Para testar:

1. Abra as **DevTools do Chrome** (F12)
2. Verifique o **Console** para erros do AdSense
3. Procure por elementos com classe `adsbygoogle`

### Modo de Produção:
Os anúncios só funcionarão corretamente quando:
- Site estiver publicado em domínio real
- Domínio estiver verificado no AdSense
- Conta AdSense estiver aprovada

## ⚙️ Configurações Recomendadas

### Otimização de Receita:
1. **Auto Ads**: Habilite no painel do AdSense para otimização automática
2. **Ads.txt**: Adicione o arquivo ads.txt no diretório public/
3. **Política de Privacidade**: Atualize sua política de privacidade informando sobre anúncios

### Compliance:
- ✅ GDPR: Implemente banner de cookies
- ✅ CCPA: Configure conforme legislação californiana
- ✅ Políticas do Google: Revise e siga as políticas do AdSense

## 🚫 Importante

### NÃO faça:
- ❌ Clicar nos próprios anúncios
- ❌ Pedir para outros clicarem
- ❌ Usar bots ou scripts para gerar cliques
- ❌ Colocar muitos anúncios (max 3 por página)

### Faça:
- ✅ Monitore métricas no painel do AdSense
- ✅ Otimize posicionamento com base em performance
- ✅ Mantenha conteúdo de qualidade
- ✅ Respeite experiência do usuário

## 📈 Métricas Esperadas

Para um app de gestão financeira:
- **CTR médio**: 1-3%
- **RPM**: €2-€8
- **Viewability**: >70%

## 🆘 Troubleshooting

### Anúncios não aparecem:
1. Verifique se substituiu TODOS os placeholders
2. Confirme que o domínio está aprovado no AdSense
3. Verifique console do navegador para erros
4. Aguarde 24-48h após configuração inicial

### Conta suspensa:
- Revise políticas do AdSense
- Entre em contato com suporte do Google
- Remova conteúdo problemático

## 💰 Previsão de Receita

Com 1.000 usuários ativos diários:
- **Pageviews**: ~5.000/dia
- **Impressões de anúncios**: ~3.000/dia
- **Receita estimada**: €5-€20/dia

**Nota**: Valores variam muito baseado em nicho, geografia e engajamento.

## 📞 Suporte

- **Google AdSense Help**: [https://support.google.com/adsense](https://support.google.com/adsense)
- **Fórum AdSense**: [https://support.google.com/adsense/community](https://support.google.com/adsense/community)

---

**Última atualização**: 2025-11-07
**Versão do gest-first**: 1.0.0
