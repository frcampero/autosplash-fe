import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";
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

const API = import.meta.env.VITE_API_URL;

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
          axios.get(`${API}/api/orders/${id}`, getAuthHeaders()),
          axios.get(`${API}/api/payments?orderId=${id}`, getAuthHeaders()),
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

      const res = await axios.put<Order>(
        `${API}/api/orders/${order._id}`,
        { status: order.status },
        getAuthHeaders()
      );

      setOrder(res.data);
      setOriginalOrder(res.data);

      toast.success("Cambios guardados correctamente");
    } catch (err: any) {
      console.error("Error al guardar", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
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
      const res = await axios.post(
        `${API}/api/payments`,
        {
          amount: Number(newAmount),
          method: newMethod,
          orderId: order._id,
        },
        getAuthHeaders()
      );

      const { payment: newPayment, order: updatedOrder } = res.data;

      setPayments((prev) => [...prev, newPayment]);
      setOrder(updatedOrder);
      setOriginalOrder(updatedOrder);

      toast.success("Pago agregado correctamente");
      setNewAmount("");
      setNewMethod("Efectivo");
    } catch (err: any) {
      console.error("❌ Error al agregar pago:", err);
      toast.error("No se pudo agregar el pago. Revisa la respuesta de la API.");
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!order) return;
    try {
      const res = await axios.delete(`${API}/api/payments/${paymentId}`, getAuthHeaders());
      
      const { order: updatedOrder } = res.data;

      setPayments((prev) => prev.filter((p) => p._id !== paymentId));
      setOrder(updatedOrder);
      setOriginalOrder(updatedOrder);

      toast.success("Pago eliminado correctamente");
    } catch (err: any) {
      console.error("❌ Error al eliminar pago:", err);
      toast.error("No se pudo eliminar el pago. Revisa la respuesta de la API.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Orden #{order.orderId}
            </h1>
            <p className="text-sm text-gray-500">
              Creada el {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className={getStatusBadgeClass(order.status)}>{order.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <EditOrderItemsDialog order={order} onOrderUpdate={handleOrderUpdate}>
            <Button variant="outline">
              <Pencil className="w-4 h-4 mr-2" />
              Editar Prendas
            </Button>
          </EditOrderItemsDialog>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
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
