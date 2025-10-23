import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-3">
        <div className="flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GestFin. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/privacy')}
              className="hover:text-primary transition-colors"
            >
              Privacidade
            </button>
            <button
              onClick={() => navigate('/terms')}
              className="hover:text-primary transition-colors"
            >
              Termos
            </button>
            <button
              onClick={() => navigate('/help')}
              className="hover:text-primary transition-colors"
            >
              Ajuda
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
