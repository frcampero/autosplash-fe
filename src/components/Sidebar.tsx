// src/components/Sidebar.jsx
import { Home, FileText, LogOut, Menu } from "lucide-react";
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
      {/* Botón Hamburguesa (solo en mobile) */}
      <div className="md:hidden p-4">
        <Button variant="outline" onClick={() => setOpen(!open)}>
          <Menu />
        </Button>
      </div>

      {/* Sidebar para desktop */}
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

      {/* Sidebar móvil desplegable */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <aside className="w-64 h-full bg-white p-6 shadow-lg flex flex-col justify-between">
            <div>
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
        </div>
      )}
    </>
  );
};

export default Sidebar;