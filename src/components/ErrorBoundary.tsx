import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/30">
          <div className="max-w-md w-full text-center animate-in fade-in-0 duration-300">
            <div className="rounded-full bg-destructive/10 p-4 inline-flex mb-4">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Algo salió mal
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Ocurrió un error inesperado. Recargá la página o volvé a intentar más tarde.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="default"
            >
              Recargar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
