import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import api from "@/lib/api";
import { logout, clearStoredToken } from "@/lib/api";
import { toast } from "sonner";

interface HeaderUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<HeaderUser | null>(null);
  const { setTheme, resolvedTheme } = useTheme();

  const fetchUser = () => {
    api.get("/api/auth/me").then((r) => setUser(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const onProfileUpdated = () => fetchUser();
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => window.removeEventListener("profile-updated", onProfileUpdated);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      clearStoredToken();
      toast.success("Sesión cerrada correctamente");
      navigate("/login");
    } catch {
      toast.error("Hubo un problema al cerrar sesión");
    }
  };

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Usuario"
    : "Usuario";
  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="grid h-screen max-h-screen w-full max-w-full overflow-hidden md:grid-cols-[13rem_1fr]">
      <div className="hidden border-r bg-background md:block relative shrink-0">
        <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-3 lg:h-[60px] lg:px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden focus:ring-0 focus:border-border"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-72">
              <Sidebar
                isCollapsed={false}
                setIsCollapsed={() => {}}
                showCollapseButton={false}
                isMobile={true}
                onNavigate={() => document.activeElement && (document.activeElement as HTMLElement).blur()}
              />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 flex items-center min-w-0">
            <Breadcrumbs />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-9 w-9 rounded-full focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={resolvedTheme === "dark" ? "Usar modo claro" : "Usar modo oscuro"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 shrink-0 focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium">
                    {initials}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium truncate">{displayName}</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-auto p-3 lg:p-4 bg-muted/40 animate-in fade-in-0 duration-200 overscroll-behavior-contain">
          <div className="flex flex-col gap-4 lg:gap-6">
            <Outlet />
          </div>
        </main>
        <footer className="shrink-0 border-t bg-background px-3 py-3 lg:px-4">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Autosplash
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;