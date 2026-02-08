import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface ClienteFrecuente {
  nombre: string;
  montoAbonado: number;
  cantidadPagos: number;
  ultimaFecha: string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);

const TopCustomersCard = () => {
  const [clientes, setClientes] = useState<ClienteFrecuente[]>([]);

  useEffect(() => {
    api
      .get("/api/customers/top")
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error cargando clientes:", err));
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Clientes destacados</CardTitle>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Por facturación reciente
        </p>
        {clientes.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No hay datos disponibles.
          </p>
        ) : (
          <ul className="space-y-0 divide-y divide-border">
            {clientes.map((c, idx) => (
              <li
                key={idx}
                className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{c.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.cantidadPagos} pago{c.cantidadPagos !== 1 ? "s" : ""} · Último:{" "}
                    {new Date(c.ultimaFecha).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {formatCurrency(c.montoAbonado)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TopCustomersCard;
