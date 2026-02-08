import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Item {
  item: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderSectionProps {
  order: {
    deliveryType?: "estándar" | "urgente";
    careLevel?: "normal" | "delicado";
    description?: string;
    items: Item[];
  };
  status: string;
  setStatus: (status: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
};

const OrderSection = ({ order, status, setStatus }: OrderSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Pedido</CardTitle>
        <CardDescription>
          Información sobre las prendas, estado y preferencias de cuidado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* --- Selector de Estado --- */}
        <div>
          <Label className="text-sm font-medium">Actualizar Estado</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full border border-input rounded-md px-3 py-2 bg-background text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="Recibido">Recibido</option>
            <option value="En progreso">En progreso</option>
            <option value="Completado">Completado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        {/* --- Preferencias --- */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Entrega</Label>
            <p className="font-medium">
              {order.deliveryType === "urgente" ? "Urgente" : "Estándar"}
            </p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Cuidado</Label>
            <p className="font-medium">
              {order.careLevel === "delicado" ? "Delicado" : "Normal"}
            </p>
          </div>
        </div>

        {/* --- Descripción --- */}
        {order.description && (
          <div>
            <Label className="text-xs text-muted-foreground">Descripción</Label>
            <p className="text-sm p-3 bg-muted rounded-md border border-border">
              {order.description}
            </p>
          </div>
        )}

        {/* --- Tabla de Prendas --- */}
        <div>
          <Label className="text-sm font-medium">Prendas Incluidas</Label>
          {/* Desktop: tabla */}
          <div className="mt-2 overflow-hidden border rounded-lg hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left font-medium text-muted-foreground"
                    >
                      Prenda
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-center font-medium text-muted-foreground"
                    >
                      Cant.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right font-medium text-muted-foreground"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {order.items && order.items.length > 0 ? (
                    order.items.map(({ item, quantity }) =>
                      item ? (
                        <tr key={item._id}>
                          <td className="px-4 py-2 font-medium text-foreground">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 text-center text-muted-foreground">
                            {quantity}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold">
                            {formatCurrency(item.price * quantity)}
                          </td>
                        </tr>
                      ) : null
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-4 text-center text-muted-foreground"
                      >
                        No hay prendas en esta orden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mobile: cards */}
          <div className="mt-2 sm:hidden space-y-2">
            {order.items && order.items.length > 0 ? (
              order.items.map(({ item, quantity }) =>
                item ? (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-3 rounded-lg border border-border bg-card text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-muted-foreground text-xs">Cant: {quantity}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * quantity)}</p>
                  </div>
                ) : null
              )
            ) : (
              <p className="px-4 py-4 text-center text-muted-foreground text-sm border rounded-lg">
                No hay prendas en esta orden.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSection;