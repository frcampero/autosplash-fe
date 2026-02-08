import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { ROUTES } from "@/routes";

const APP_TITLE = "Autosplash";

export function NotFoundPage() {
  useEffect(() => {
    document.title = `Página no encontrada · ${APP_TITLE}`;
    return () => {
      document.title = APP_TITLE;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/30">
      <div className="max-w-md w-full text-center animate-in fade-in-0 duration-300">
        <div className="rounded-full bg-muted p-4 inline-flex mb-4">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Página no encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          La ruta que buscás no existe o fue movida. Volvé al inicio para continuar.
        </p>
        <Button asChild>
          <Link to={ROUTES.HOME}>Ir al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
