import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReceiptDownloadButton, DeletePaymentButton } from ".";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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
  };
  payments: Payment[];
  paid: string;
  newAmount: string;
  setNewAmount: (val: string) => void;
  newMethod: string;
  setNewMethod: (val: string) => void;
  handleAddPayment: () => void;
  handleDeletePayment: (id: string) => void;
}

const getPaymentStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Pagado":
      return "bg-green-100 text-green-800";
    case "Parcial":
      return "bg-yellow-100 text-yellow-800";
    case "Pendiente":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderPaymentSection = ({
  order,
  payments,
  paid,
  newAmount,
  setNewAmount,
  newMethod,
  setNewMethod,
  handleAddPayment,
  handleDeletePayment,
}: Props) => {
  const totalAbonado = payments.reduce((acc, p) => acc + p.amount, 0);
  const restante = Math.max(order.total - totalAbonado, 0);
  const estadoPago =
    totalAbonado >= order.total
      ? "Pagado"
      : totalAbonado > 0
      ? "Parcial"
      : "Pendiente";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos y Resumen</CardTitle>
        <CardDescription>
          Gestiona los pagos y visualiza el resumen financiero de la orden.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* --- Resumen Financiero --- */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total de la Orden:</span>
            <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Abonado:</span>
            <span className="font-semibold text-green-600">
              ${totalAbonado.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-2 mt-2">
            <span className="font-semibold">Saldo Restante:</span>
            <span className="font-bold text-xl text-red-600">
              ${restante.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estado del Pago:</span>
            <Badge className={getPaymentStatusBadgeClass(estadoPago)}>
              {estadoPago}
            </Badge>
          </div>
        </div>

        {/* --- Historial de Pagos --- */}
        {payments.length > 0 && (
          <div>
            <Label className="text-sm font-medium">Historial de Pagos</Label>
            <ul className="mt-2 space-y-2 text-sm text-gray-700 border rounded-md p-3">
              {payments.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center pb-1"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">${p.amount.toFixed(2)}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{p.method}</Badge>
                    <DeletePaymentButton
                      onConfirm={() => handleDeletePayment(p._id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* --- Agregar Nuevo Pago --- */}
        <div>
          <Label className="text-sm font-medium">Agregar Nuevo Pago</Label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="border rounded-md px-3 py-2 bg-white cursor-pointer w-full"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de Credito">Tarjeta de Crédito</option>
              <option value="Tarjeta de debito">Tarjeta de Débito</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          type="button"
          onClick={handleAddPayment}
          disabled={
            !newAmount || isNaN(Number(newAmount)) || Number(newAmount) <= 0
          }
          className="w-full"
        >
          Agregar Pago
        </Button>
        <ReceiptDownloadButton orderId={order._id} className="w-full" />
      </CardFooter>
    </Card>
  );
};

export default OrderPaymentSection;
