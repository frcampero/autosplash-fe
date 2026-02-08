import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "@/routes";
import { cn } from "@/lib/utils";

function getBreadcrumbs(pathname: string): { path: string; label: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [{ path: "/", label: "Inicio" }];

  const items: { path: string; label: string }[] = [];
  let acc = "";

  for (let i = 0; i < segments.length; i++) {
    acc += (acc ? "/" : "") + segments[i];
    const fullPath = "/" + acc;
    let label: string;

    if (fullPath === ROUTES.HOME) label = "Inicio";
    else if (fullPath === ROUTES.ORDERS) label = "Órdenes";
    else if (fullPath === ROUTES.ORDER_NEW) label = "Nueva orden";
    else if (fullPath === ROUTES.CUSTOMERS) label = "Clientes";
    else if (fullPath === ROUTES.CUSTOMER_NEW) label = "Nuevo cliente";
    else if (fullPath === ROUTES.PRICES) label = "Precios";
    else if (fullPath === ROUTES.USERS) label = "Usuarios";
    else if (fullPath === ROUTES.USER_NEW) label = "Nuevo usuario";
    else if (fullPath === ROUTES.SETTINGS) label = "Configuración";
    else if (segments[i] === "edit") label = "Editar";
    else if (/^[a-f0-9]{24}$/i.test(segments[i])) label = "Detalle";
    else label = segments[i];

    items.push({ path: fullPath, label });
  }

  return items;
}

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const items = getBreadcrumbs(pathname);

  if (items.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0 overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
            {isLast ? (
              <span className={cn("font-medium text-foreground")}>{item.label}</span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
