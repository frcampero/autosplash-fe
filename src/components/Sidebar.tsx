// src/components/Sidebar.jsx
import { Home, FileText, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", icon: <Home size={20} />, label: "Inicio" },
    { to: "/tickets", icon: <FileText size={20} />, label: "Tickets" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Botón Hamburguesa (solo en mobile, arriba izquierda) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
          <Menu />
        </Button>
      </div>

      {/* Sidebar permanente para desktop */}
      <aside className="hidden md:flex w-64 h-screen border-r bg-white px-4 py-6 shadow-sm flex-col justify-between">
        <div>
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2 mt-4"
        >
          <LogOut size={18} />
          Cerrar sesión
        </Button>
      </aside>

      {/* Sidebar tipo Drawer para Mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white md:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 flex flex-col justify-between px-4 py-6 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Botón de cerrar */}
        <div className="flex justify-end mb-4 bg-white border-r-2">
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X />
          </Button>
        </div>

        {/* Navegación */}
        <div className="flex-1">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.to
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <Button
          onClick={() => {
            handleLogout();
            setOpen(false);
          }}
          variant="outline"
          className="flex items-center gap-2 mt-4"
        >
          <LogOut size={18} />
          Cerrar sesión
        </Button>
      </aside>
    </>
  );
};

export default Sidebar;