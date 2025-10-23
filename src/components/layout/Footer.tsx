import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">GestFin</h3>
            <p className="text-sm text-muted-foreground">
              Gestão Financeira Pessoal Inteligente
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GestFin. Todos os direitos reservados.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Termos de Uso
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/gdpr')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  RGPD / GDPR
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/help')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Ajuda
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Meu Perfil
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
