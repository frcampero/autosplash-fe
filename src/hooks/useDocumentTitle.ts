import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/routes";

const APP_TITLE = "Autosplash";

const pathToTitle: Record<string, string> = {
  [ROUTES.HOME]: "Inicio",
  [ROUTES.LOGIN]: "Iniciar sesión",
  [ROUTES.ORDERS]: "Órdenes",
  [ROUTES.ORDER_NEW]: "Nueva orden",
  [ROUTES.CUSTOMERS]: "Clientes",
  [ROUTES.CUSTOMER_NEW]: "Nuevo cliente",
  [ROUTES.PRICES]: "Precios",
  [ROUTES.USERS]: "Usuarios",
  [ROUTES.USER_NEW]: "Nuevo usuario",
  [ROUTES.SETTINGS]: "Configuración",
};

function getTitleForPath(pathname: string): string {
  if (pathToTitle[pathname]) return pathToTitle[pathname];
  if (pathname.startsWith("/orders/") && pathname !== ROUTES.ORDER_NEW) {
    return pathname.endsWith("/nuevo") ? "Nueva orden" : "Detalle de orden";
  }
  if (pathname.startsWith("/customers/")) {
    if (pathname.includes("/edit/")) return "Editar cliente";
    return "Cliente";
  }
  if (pathname.startsWith("/users/")) {
    if (pathname.includes("/edit/")) return "Editar usuario";
    if (pathname.endsWith("/new")) return "Nuevo usuario";
    return "Usuarios";
  }
  if (pathname.startsWith("/lookup/")) return "Ver orden";
  return APP_TITLE;
}

export function useDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = getTitleForPath(pathname);
    document.title = pageTitle === APP_TITLE ? APP_TITLE : `${pageTitle} · ${APP_TITLE}`;
  }, [pathname]);
}
