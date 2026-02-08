import type { AxiosError } from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
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
import { MoreVertical, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import DeleteOrderDialog from "./DeleteOrderDialog";
import { TableSkeleton } from "@/components/TableSkeleton";

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
      return "bg-muted text-muted-foreground";
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Recibido":
      return "bg-primary/15 text-primary";
    case "En progreso":
      return "bg-yellow-100 text-yellow-800";
    case "Completado":
      return "bg-green-100 text-green-800";
    case "Entregado":
      return "bg-muted text-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const OrderTable = ({ orders, loading, refreshOrders }: Props) => {
  if (loading) return <TableSkeleton rows={8} columns={6} />;

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg border border-border text-center animate-in fade-in-0 duration-300">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          No hay órdenes aún
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Creá tu primera orden para empezar a cargar tickets y llevar el control de los pedidos.
        </p>
        <Button asChild>
          <Link to="/orders/nuevo">+ Nueva orden</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/orders/${id}`);
      toast.success("Orden eliminada correctamente");
      refreshOrders();
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const mensaje =
        err.response?.data?.error || "Error al eliminar la orden";
      console.error("❌ Error al eliminar la orden:", mensaje);
      toast.error(mensaje);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* --- Vista de Tabla (Desktop) --- */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Orden #
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Cliente
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Fecha
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Estado de Orden
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Estado de pago
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-2 px-4">{order.orderId}</td>
                <td className="py-2 px-4">
                  {order.customerId
                    ? `${order.customerId.firstName} ${order.customerId.lastName}`
                    : "Cliente desconocido"}
                </td>
                <td className="py-2 px-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-2 px-4">
                  <Badge
                    className={getPaymentClass(getPaymentStatus(order))}
                    title={`Pagado: $${order.paid} / Total: $${order.total}`}
                  >
                    {getPaymentStatus(order)}
                  </Badge>
                </td>
                <td className="py-2 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() =>
                          (window.location.href = `/orders/${order._id}`)
                        }
                        className="cursor-pointer"
                      >
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => downloadReceipt(order._id)}
                        className="cursor-pointer"
                      >
                        Descargar PDF
                      </DropdownMenuItem>
                      <DeleteOrderDialog
                        onDelete={() => handleDelete(order._id)}
                      >
                        <div
                          className="cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50"
                        >
                          Eliminar
                        </div>
                      </DeleteOrderDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Vista de Tarjetas (Mobile) --- */}
      <div className="md:hidden">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border-b p-4 space-y-3 bg-card"
            onClick={() => (window.location.href = `/orders/${order._id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-base">Orden #{order.orderId}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerId
                    ? `${order.customerId.firstName} ${order.customerId.lastName}`
                    : "Cliente desconocido"}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()} // Evita que el click se propague al div contenedor
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onSelect={() =>
                      (window.location.href = `/orders/${order._id}`)
                    }
                  >
                    Ver Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => downloadReceipt(order._id)}>
                    Descargar PDF
                  </DropdownMenuItem>
                  <DeleteOrderDialog
                    onDelete={() => handleDelete(order._id)}
                  >
                    <div
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </div>
                  </DeleteOrderDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total</p>
                <p className="font-medium">${order.total?.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge className={getStatusBadgeClass(order.status)}>
                {order.status}
              </Badge>
              <Badge
                className={getPaymentClass(getPaymentStatus(order))}
                title={`Pagado: $${order.paid} / Total: $${order.total}`}
              >
                {getPaymentStatus(order)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTable;
