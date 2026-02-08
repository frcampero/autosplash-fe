import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  OrderCustomerSection,
  OrderSection,
  OrderPaymentSection,
  EditOrderItemsDialog,
} from "../components";
import { ArrowLeft, Pencil, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";
interface Payment {
  _id: string;
  amount: number;
  method: string;
  createdAt: string;
}

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

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [originalOrder, setOriginalOrder] = useState<Order | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newAmount, setNewAmount] = useState("");
  const [newMethod, setNewMethod] = useState("Efectivo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const [orderRes, paymentsRes] = await Promise.all([
          api.get(`/api/orders/${id}`),
          api.get(`/api/payments?orderId=${id}`),
        ]);
        setOrder(orderRes.data);
        setOriginalOrder(orderRes.data);
        setPayments(paymentsRes.data.results || []);
      } catch (err) {
        console.error("❌ Error al cargar datos de la orden:", err);
        toast.error("No se pudo cargar la información de la orden");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrder(updatedOrder);
    setOriginalOrder(updatedOrder);
  };

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      setOrder({ ...order, status: newStatus });
    }
  };

  const handleSave = async () => {
    if (!order) return;
    setIsSaving(true);

    try {

      const res = await api.put<Order>(`/api/orders/${order._id}`, {
        status: order.status,
      });

      setOrder(res.data);
      setOriginalOrder(res.data);

      toast.success("Cambios guardados correctamente");
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      console.error("Error al guardar", err);
      const errorMsg =
        axiosErr.response?.data?.error ??
        axiosErr.response?.data?.message ??
        "Error desconocido";

      toast.error("Error al actualizar la orden", {
        description: errorMsg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPayment = async () => {
    if (!newAmount || isNaN(Number(newAmount))) {
      toast.error("El monto ingresado no es válido");
      return;
    }
    if (!order) return;

    try {
      const res = await api.post("/api/payments", {
        amount: Number(newAmount),
        method: newMethod,
        orderId: order._id,
      });

      const { payment: newPayment, order: updatedOrder } = res.data;

      setPayments((prev) => [...prev, newPayment]);
      setOrder(updatedOrder);
      setOriginalOrder(updatedOrder);

      toast.success("Pago agregado correctamente");
      setNewAmount("");
      setNewMethod("Efectivo");
    } catch (err) {
      console.error("❌ Error al agregar pago:", err);
      toast.error("No se pudo agregar el pago. Revisa la respuesta de la API.");
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!order) return;
    try {
      const res = await api.delete(`/api/payments/${paymentId}`);
      
      const { order: updatedOrder } = res.data;

      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
      setOrder(updatedOrder);
      setOriginalOrder(updatedOrder);

      toast.success("Pago eliminado correctamente");
    } catch (err) {
      console.error("❌ Error al eliminar pago:", err);
      toast.error("No se pudo eliminar el pago. Revisa la respuesta de la API.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Cargando detalle de la orden...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudieron cargar los datos de la orden.
      </div>
    );
  }

  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const hasChanges = order.status !== originalOrder?.status;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      {/* --- Header --- */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                  Orden #{order.orderId}
                </h1>
                <Badge className={getStatusBadgeClass(order.status)}>{order.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Creada el {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <EditOrderItemsDialog order={order} onOrderUpdate={handleOrderUpdate}>
              <Button variant="outline" className="w-full sm:w-auto">
                <Pencil className="w-4 h-4 mr-2 shrink-0" />
                Editar Prendas
              </Button>
            </EditOrderItemsDialog>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="w-full sm:w-auto">
              {isSaving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* --- Main Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {order && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <OrderSection order={order} status={order.status} setStatus={handleStatusChange} />
            </div>
            <div className="space-y-6">
              <OrderCustomerSection order={order} />
              <OrderPaymentSection
                order={order}
                payments={payments}
                paid={totalPaid.toString()}
                newAmount={newAmount}
                setNewAmount={setNewAmount}
                newMethod={newMethod}
                setNewMethod={setNewMethod}
                handleAddPayment={handleAddPayment}
                handleDeletePayment={handleDeletePayment}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
