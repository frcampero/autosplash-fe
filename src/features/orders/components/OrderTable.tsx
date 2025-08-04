import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";
import { downloadReceipt } from "@/utils/downloadReceipt";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

import DeleteOrderDialog from "./DeleteOrderDialog";

interface Props {
  orders: Order[];
  loading: boolean;
  refreshOrders: () => void;
}

const getPaymentStatus = (order: Order) => {
  const total = order.total || 0;
  const paid = order.paid || 0;

  if (paid >= total) return "Pagado";
  if (paid > 0 && paid < total) return "Parcial";
  return "Pendiente";
};

const getPaymentClass = (status: string) => {
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

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Recibido":
      return "bg-blue-100 text-blue-800";
    case "En progreso":
      return "bg-yellow-100 text-yellow-800";
    case "Completado":
      return "bg-green-100 text-green-800";
    case "Entregado":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const OrderTable = ({ orders, loading, refreshOrders }: Props) => {
  if (loading) return <div className="p-4">Cargando ordenes...</div>;

  if (!orders.length) {
    return <div className="p-4 text-gray-500">No hay ordenes aún. </div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        getAuthHeaders()
      );
      toast.success("Orden eliminada correctamente");
      refreshOrders();
    } catch (error: any) {
      const mensaje =
        error.response?.data?.error || "Error al eliminar la orden";
      console.error("❌ Error al eliminar la orden:", mensaje);
      toast.error(mensaje);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-semibold text-gray-700">
                Orden #
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700">
                Cliente
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700">
                Fecha
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700">
                Estado de Orden
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700">
                Estado de pago
              </th>
              <th className="text-left py-2 px-2 font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-white">
                <td className="py-2 px-2">{order.orderId}</td>
                <td className="py-2 px-2">
                  {order.customerId
                    ? `${order.customerId.firstName} ${order.customerId.lastName}`
                    : "Cliente desconocido"}
                </td>
                <td className="py-2 px-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-2">
                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-2 px-2">
                  <Badge
                    className={getPaymentClass(getPaymentStatus(order))}
                    title={`Pagado: $${order.paid} / Total: $${order.total}`}
                  >
                    {getPaymentStatus(order)}
                  </Badge>
                </td>
                <td className="py-2 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 cursor-pointer bg-white text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="!bg-white !text-gray-900 dark:!bg-white dark:!text-gray-900 border border-gray-200 shadow-md"
                    >
                      <DropdownMenuItem
                        onClick={() =>
                          (window.location.href = `/orders/${order._id}`)
                        }
                        className="cursor-pointer"
                      >
                        Ver
                      </DropdownMenuItem>
                      <DeleteOrderDialog
                        onConfirm={() => handleDelete(order._id)}
                      >
                        <div className="px-2 py-1 text-sm hover:bg-red-50 cursor-pointer">
                          Eliminar
                        </div>
                      </DeleteOrderDialog>
                      <DropdownMenuItem
                        onClick={() =>
                          downloadReceipt(order._id).catch(() =>
                            toast.error("No se pudo generar el comprobante PDF")
                          )
                        }
                        className="cursor-pointer"
                      >
                        Descargar PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrderTable;
