import { Input } from "@/components/ui/input";

interface Props {
  order: {
    customerId: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      address: string;
    };
    deliveryType: "estándar" | "urgente";
    careLevel: "normal" | "delicado";
    description: string;
    createdAt: string;
  };
  status: string;
  setStatus: (status: string) => void;
}

const OrderSection = ({ order, status, setStatus }: Props) => {
  return (
    <fieldset className="space-y-3 border rounded p-4">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Detalles del pedido
      </legend>
      <div>
        <label className="text-sm font-medium">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
        >
          <option value="Recibido">Recibido</option>
          <option value="En progreso">En progreso</option>
          <option value="Completado">Completado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>
      <Input
        readOnly
        value={`Entrega: ${
          order.deliveryType === "urgente" ? "Urgente" : "Estándar"
        }`}
        className="pointer-events-none bg-gray-50 cursor-default"
      />
      <Input
        readOnly
        value={`Cuidado: ${
          order.careLevel === "delicado" ? "Delicado" : "Normal"
        }`}
        className="pointer-events-none bg-gray-50 cursor-default"
      />

      <textarea
        readOnly
        value={order.description}
        rows={4}
        className="w-full border rounded px-3 py-2 text-sm bg-gray-50 pointer-events-none cursor-default"
      />
      <Input
        readOnly
        value={new Date(order.createdAt).toLocaleDateString()}
        placeholder="Fecha"
        className="pointer-events-none bg-gray-50 cursor-default"
      />
    </fieldset>
  );
};

export default OrderSection;
