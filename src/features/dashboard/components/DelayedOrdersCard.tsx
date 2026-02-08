import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Order {
  _id: string;
  nombre: string;
  estado: string;
  fecha: string;
}

const DelayedOrdersCard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    api
      .get("/api/orders/delayed")
      .then((res) => {
        setOrders(res.data.orders || []);
        setTotalCount(res.data.totalCount || 0);
      })
      .catch((err) => console.error("Error al cargar órdenes atrasadas:", err));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Tickets atrasados</CardTitle>
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <span className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {totalCount} en total
            </span>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Se consideran atrasados si no se completan en 3 días. Se muestran los 5 más antiguos.
        </p>
        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/30 py-8 text-center">
            <p className="text-sm font-medium text-foreground">Todo al día</p>
            <p className="mt-1 text-xs text-muted-foreground">
              No hay tickets atrasados.
            </p>
          </div>
        ) : (
          <ul className="space-y-0 divide-y divide-border">
            {orders.map((o) => (
              <li
                key={o._id}
                onClick={() => navigate(`/orders/${o._id}`)}
                className="flex cursor-pointer items-center justify-between gap-4 py-3 transition-colors hover:bg-muted/50 first:pt-0 last:pb-0 -mx-2 px-2 rounded-lg"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{o.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    Ingresó hace {formatDistanceToNow(new Date(o.fecha), { locale: es })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{o.estado}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default DelayedOrdersCard;
