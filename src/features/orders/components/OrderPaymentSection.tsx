import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReceiptDownloadButton, DeletePaymentButton } from ".";

interface Payment {
  _id: string;
  amount: number;
  method: string;
  createdAt: string;
}

interface Props {
  order: {
    _id: string;
    total: number;
    createdAt: string;
  };
  payments: Payment[];
  paid: string;
  newAmount: string;
  setNewAmount: (val: string) => void;
  newMethod: string;
  setNewMethod: (val: string) => void;
  handleAddPayment: () => void;
  isSaving: boolean;
  handleSave: () => void;
  hasChanges: boolean;
  handleDeletePayment: (id: string) => void;
}

const OrderPaymentSection = ({
  order,
  payments,
  paid,
  newAmount,
  setNewAmount,
  newMethod,
  setNewMethod,
  handleAddPayment,
  isSaving,
  handleSave,
  hasChanges,
  handleDeletePayment,
}: Props) => {
  const totalAbonado = payments.reduce((acc, p) => acc + p.amount, 0);
  const restante = Math.max(order.total - totalAbonado, 0).toFixed(2);
  const estadoPago =
    totalAbonado >= order.total
      ? "Pagado"
      : totalAbonado > 0
      ? "Parcial"
      : "Pendiente";
  const ultimoMetodo =
    payments.length > 0 ? payments[0].method : "Sin pagos aún";

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case "Pagado":
        return "text-green-600 font-semibold";
      case "Parcial":
        return "text-yellow-600 font-semibold";
      case "Pendiente":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  return (
    <fieldset className="space-y-3 border rounded p-4 flex flex-col justify-between">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Estado de pago
      </legend>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">Total:</p>
        <Input
          readOnly
          value={order.total.toString()}
          className="pointer-events-none bg-gray-50 cursor-default"
        />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700">Abonado:</p>
        <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-sm text-gray-700">
          ${Number(paid).toFixed(2)}
        </div>
      </div>

      <div className="text-sm text-gray-600">Restante: ${restante}</div>
      <div className="text-sm">
        Estado de pago:{" "}
        <span className={getPaymentStatusClass(estadoPago)}>{estadoPago}</span>
      </div>

      <p className="text-sm text-gray-600">
        Último método de pago: <strong>{ultimoMetodo}</strong>
      </p>

      {payments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Historial de pagos</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {payments.map((p) => (
              <li
                key={p._id}
                className="flex justify-between items-center border-b pb-1"
              >
                <div className="flex flex-col">
                  <span>${p.amount.toFixed(2)}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{p.method}</span>
                  <DeletePaymentButton
                    onConfirm={() => handleDeletePayment(p._id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        Días desde creación:{" "}
        {Math.floor(
          (Date.now() - new Date(order.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        )}{" "}
        días
      </p>

      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium mb-2">Agregar nuevo pago</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            type="number"
            placeholder="Monto"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="bg-white"
          />
          <select
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)}
            className="border rounded px-3 py-2 bg-white cursor-pointer"
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta de Credito">Tarjeta de Crédito</option>
            <option value="Tarjeta de debito">Tarjeta de Débito</option>
            <option value="Transferencia">Transferencia</option>
          </select>
          <Button
            type="button"
            onClick={handleAddPayment}
            disabled={
              !newAmount || isNaN(Number(newAmount)) || Number(newAmount) <= 0
            }
          >
            Agregar
          </Button>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      <Button
        type="submit"
        className="mt-2"
        disabled={isSaving || !hasChanges}
        onClick={handleSave}
      >
        {isSaving ? "Guardando..." : "Guardar cambios"}
      </Button>

      <ReceiptDownloadButton orderId={order._id} />
    </fieldset>
  );
};

export default OrderPaymentSection;
