import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
      <div className="container px-4 py-2">
        <div className="flex flex-col items-center justify-between gap-1 text-xs text-muted-foreground sm:flex-row sm:text-sm">
          <p className="hidden sm:block">© {new Date().getFullYear()} GestFin</p>
          <div className="flex gap-3 sm:gap-4">
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
