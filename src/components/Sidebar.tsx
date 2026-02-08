import { useEffect, useState } from "react";
import {
  Home,
  FileText,
  LogOut,
  Tag,
  Users,
  UserCog,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import api from "@/lib/api";
import { logout, clearStoredToken } from "@/lib/api";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import React from "react";
import { SheetClose } from "@/components/ui/sheet";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  onNavigate?: () => void;
  showCollapseButton?: boolean;
  isMobile?: boolean;
}

const links = [
  { to: "/", icon: Home, label: "Inicio", exact: true },
  { to: "/orders", icon: FileText, label: "Órdenes", exact: false },
  { to: "/customers", icon: Users, label: "Clientes", exact: false },
  { to: "/prices", icon: Tag, label: "Precios", exact: true },
];

interface NavLinkItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  isMobile?: boolean;
  onNavigate?: () => void;
}

function isLinkActive(pathname: string, to: string, exact: boolean): boolean {
  if (exact) return pathname === to;
  return pathname === to || pathname.startsWith(to + "/");
}

const NavLinkItem = ({
  to,
  icon: Icon,
  label,
  isCollapsed,
  isActive,
  isMobile,
  onNavigate,
}: NavLinkItemProps) => {
  const content = (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn(
        "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "border-l-[3px] border-transparent",
        isActive
          ? "bg-primary/10 text-primary border-l-primary"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground border-l-transparent"
      )}
    >
      <Icon className="h-5 w-5 shrink-0 flex-shrink-0" />
      <span
        className={cn(
          "truncate overflow-hidden transition-all duration-200 ease-out",
          isCollapsed ? "max-w-0 opacity-0 min-w-0" : "max-w-[8rem] opacity-100"
        )}
      >
        {label}
      </span>
    </Link>
  );

  const wrapped = isMobile ? (
    <SheetClose asChild>{content}</SheetClose>
  ) : (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="font-medium">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return wrapped;
};

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  onNavigate,
  isMobile,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.get("/api/auth/me").then((r) => setIsAdmin(r.data?.role === "admin")).catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      clearStoredToken();
      toast.success("Sesión cerrada correctamente");
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      toast.error("Hubo un problema al cerrar sesión");
    }
  };

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen max-h-screen flex-col border-r border-border bg-card overflow-x-hidden",
        "transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isMobile ? "w-72" : isCollapsed ? "w-[4.5rem]" : "w-52"
      )}
    >
      {/* Header con logo */}
      <div
        className={cn(
          "flex items-center justify-center shrink-0 min-h-[4.5rem] border-b border-border/80 bg-muted/30 overflow-hidden",
          "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isCollapsed ? "h-16 px-2" : "px-4 py-4"
        )}
      >
        {!isCollapsed ? (
          <Link to="/" className="block outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg">
            <img
              src="/imagotipo-claro.png"
              alt="Autosplash"
              className="h-8 w-auto object-contain"
            />
          </Link>
        ) : (
          <Link to="/" className="block outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-primary rounded-full">
            <img
              src="/isotipo-claro.png"
              alt="Autosplash"
              className="h-9 w-9 object-contain mx-auto"
            />
          </Link>
        )}
      </div>

      {/* Navegación */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto py-4 transition-all duration-300",
          isCollapsed ? "px-2 space-y-0.5" : "px-3 space-y-0.5"
        )}
      >
        {!isMobile && (
          <p
            className={cn(
              "px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider overflow-hidden transition-all duration-200 ease-out",
              isCollapsed ? "max-h-0 mb-0 py-0 opacity-0" : "max-h-5 opacity-100"
            )}
          >
            Navegación
          </p>
        )}
        {links.map((link) => (
          <NavLinkItem
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isCollapsed={isCollapsed}
            isActive={isLinkActive(location.pathname, link.to, link.exact ?? false)}
            isMobile={isMobile}
            onNavigate={onNavigate}
          />
        ))}
        {isAdmin && (
          <NavLinkItem
            to="/users"
            icon={UserCog}
            label="Usuarios"
            isCollapsed={isCollapsed}
            isActive={location.pathname === "/users" || location.pathname.startsWith("/users/")}
            isMobile={isMobile}
            onNavigate={onNavigate}
          />
        )}
      </nav>

      {/* Cerrar sesión */}
      <div
        className={cn(
          "shrink-0 border-t border-border/80 bg-muted/20 py-3 transition-all duration-300",
          isCollapsed ? "px-2" : "px-3"
        )}
      >
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-center gap-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors font-medium",
            isCollapsed ? "px-0 py-2.5" : "px-3 py-2.5"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0 flex-shrink-0" />
          <span
            className={cn(
              "truncate overflow-hidden transition-all duration-200 ease-out",
              isCollapsed ? "max-w-0 opacity-0 min-w-0" : "max-w-[8rem] opacity-100"
            )}
          >
            Cerrar sesión
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
