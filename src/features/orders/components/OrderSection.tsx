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
            className="mt-1 block w-full border rounded-md px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <Label className="text-xs text-gray-500">Entrega</Label>
            <p className="font-medium">
              {order.deliveryType === "urgente" ? "Urgente" : "Estándar"}
            </p>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Cuidado</Label>
            <p className="font-medium">
              {order.careLevel === "delicado" ? "Delicado" : "Normal"}
            </p>
          </div>
        </div>

        {/* --- Descripción --- */}
        {order.description && (
          <div>
            <Label className="text-xs text-gray-500">Descripción</Label>
            <p className="text-sm p-3 bg-gray-50 rounded-md border">
              {order.description}
            </p>
          </div>
        )}

        {/* --- Tabla de Prendas --- */}
        <div>
          <Label className="text-sm font-medium">Prendas Incluidas</Label>
          <div className="mt-2 overflow-hidden border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 text-left font-medium text-gray-600"
                    >
                      Prenda
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-center font-medium text-gray-600"
                    >
                      Cant.
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right font-medium text-gray-600"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {order.items && order.items.length > 0 ? (
                    order.items.map(({ item, quantity }) =>
                      item ? (
                        <tr key={item._id}>
                          <td className="px-4 py-2 font-medium text-gray-800">
                            {item.name}
                          </td>
                          <td className="px-4 py-2 text-center text-gray-600">
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
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No hay prendas en esta orden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSection;