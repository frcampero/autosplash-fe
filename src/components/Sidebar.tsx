// src/components/Sidebar.jsx
import { Home, FileText, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", icon: <Home size={20} />, label: "Inicio" },
    { to: "/tickets", icon: <FileText size={20} />, label: "Tickets" },
    // { to: "/customers", icon: <FileText size={20} />, label: "Clientes" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen border-r bg-white px-4 py-6 shadow-sm flex flex-col justify-between">
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
  );
};

export default Sidebar;
