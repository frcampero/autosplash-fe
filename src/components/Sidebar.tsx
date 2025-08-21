import {
  Home,
  FileText,
  LogOut,
  Tag,
  Users,
  ChevronLeft
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { logout } from "@/lib/api";
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

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  pathname: string;
}

const NavLink = ({ to, icon, label, isCollapsed, pathname }: NavLinkProps) => {
  const isActive = pathname === to;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
              isActive && "bg-muted text-primary",
              isCollapsed && "h-10 w-10 justify-center px-0"
            )}
          >
            {icon}
            <span className={cn("truncate", isCollapsed && "sr-only")}>
              {label}
            </span>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, onNavigate, showCollapseButton, isMobile }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const links = [
    { to: "/", icon: <Home className="h-6 w-6" />, label: "Inicio" },
    { to: "/orders", icon: <FileText className="h-6 w-6" />, label: "Órdenes" },
    { to: "/customers", icon: <Users className="h-6 w-6" />, label: "Clientes" },
    { to: "/prices", icon: <Tag className="h-6 w-6" />, label: "Precios" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
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
        "sticky top-0 flex h-screen max-h-screen flex-col border-r bg-white shadow-2xl transition-all duration-300 ease-in-out",
        isMobile ? "w-72" : (isCollapsed ? "w-20" : "w-56")
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          isCollapsed ? "px-2" : "px-6"
        )}
        style={{ minHeight: '60px', position: 'relative' }}
      >
        {!isCollapsed ? (
          <img src="/imagotipo-claro.png" alt="Autosplash" className="h-7 w-auto mx-auto transition-all duration-300" />
        ) : (
          <img src="/isotipo-claro.png" alt="Isotipo Autosplash" className="h-8 w-auto mx-auto transition-all duration-300" />
        )}
        <div className="absolute left-0 bottom-0 w-full border-b border-gray-200 pointer-events-none" />
      </div>

      {!isMobile && (
        <div className="absolute -right-4 top-8 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="shadow-lg bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition"
            style={{ outline: 'none', boxShadow: 'none' }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={isCollapsed ? 'rotate-180 h-5 w-5' : 'h-5 w-5'} />
          </Button>
        </div>
      )}

      <nav className={cn("flex-1 space-y-2 transition-all duration-300", isCollapsed ? "px-1 py-2" : "px-4 py-6")}> 
        {links.map((link) => (
          isMobile ? (
            <SheetClose asChild key={link.to}>
              <Button
                variant={location.pathname === link.to ? "secondary" : "outline"}
                className={cn(
                  "w-full flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0",
                  location.pathname === link.to
                    ? "bg-blue-100 text-blue-700 shadow-md"
                    : "text-gray-700 hover:bg-gray-50 hover:scale-[1.03] hover:shadow-sm",
                  isCollapsed && "justify-center px-0 py-2"
                )}
                onClick={() => {
                  navigate(link.to);
                  if (typeof onNavigate === "function") onNavigate();
                }}
                tabIndex={0}
              >
                <span
                  className={cn(
                    "",
                    location.pathname === link.to
                      ? "text-blue-600"
                      : "text-gray-400"
                  )}
                >
                  {link.icon}
                </span>
                <span className={cn("truncate", isCollapsed && "sr-only")}> 
                  {link.label}
                </span>
              </Button>
            </SheetClose>
          ) : (
            <Button
              key={link.to}
              variant={location.pathname === link.to ? "secondary" : "outline"}
              className={cn(
                "w-full flex items-center gap-4 rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0",
                location.pathname === link.to
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "text-gray-700 hover:bg-gray-50 hover:scale-[1.03] hover:shadow-sm",
                isCollapsed && "justify-center px-0 py-2"
              )}
              onClick={() => {
                navigate(link.to);
                if (typeof onNavigate === "function") onNavigate();
              }}
              tabIndex={0}
            >
              <span
                className={cn(
                  "",
                  location.pathname === link.to
                    ? "text-blue-600"
                    : "text-gray-400"
                )}
              >
                {link.icon}
              </span>
              <span className={cn("truncate", isCollapsed && "sr-only")}> 
                {link.label}
              </span>
            </Button>
          )
        ))}
      </nav>

      <div className="px-4">
        <hr className="my-4 border-gray-200" />
      </div>

      <div className="px-4 pb-6">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className={cn(
            "w-full flex items-center gap-4 rounded-lg transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200 text-lg font-medium",
            isCollapsed ? "justify-center px-0 py-2" : "px-4 py-3"
          )}
        >
          <LogOut className="h-6 w-6" />
          <span className={cn("truncate", isCollapsed && "sr-only")}> 
            Cerrar sesión
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
