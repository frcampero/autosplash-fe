import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";
import {
  OrderCustomerSection,
  OrderSection,
  OrderPaymentSection,
} from "../components";

interface Order {
  _id: string;
  orderId: number;
  status: string;
  description: string;
  total: number;
  paid: number;
  createdAt: string;
  deliveryType: "estándar" | "urgente";
  careLevel: "normal" | "delicado";
  customerId: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
}
interface Payment {
  _id: string;
  amount: number;
  method: string;
  createdAt: string;
}

const API = import.meta.env.VITE_API_URL;

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [paid, setPaid] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [newAmount, setNewAmount] = useState("");
  const [newMethod, setNewMethod] = useState("Efectivo");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [orderRes, paymentsRes] = await Promise.all([
          axios.get(`${API}/api/orders/${id}`, getAuthHeaders()),
          axios.get(`${API}/api/payments?orderId=${id}`, getAuthHeaders()),
        ]);

        setOrder(orderRes.data);
        setStatus(orderRes.data.status);

        const pagos = paymentsRes.data.results || [];
        setPayments(pagos);
        const totalPagado = pagos.reduce(
          (acc: number, p: { amount: number }) => acc + p.amount,
          0
        );
        setPaid(totalPagado.toString());
      } catch (err) {
        console.error("❌ Error al obtener datos de la orden y pagos:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!order) return;
    setIsSaving(true);

    try {
      const totalAbonado = payments.reduce((acc, p) => acc + p.amount, 0);

      if (totalAbonado > order.total) {
        toast.warning("Esta orden tiene pagos que superan el total estimado", {
          description: `Total: $${order.total} / Abonado: $${totalAbonado}`,
        });
      }

      await axios.put(
        `${API}/api/orders/${order._id}`,
        { status },
        getAuthHeaders()
      );

      //Actualizar el estado local de la orden
      setOrder((prev) => (prev ? { ...prev, status } : prev));

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

    try {
      await axios.post(
        `${API}/api/payments`,
        {
          amount: Number(newAmount),
          method: newMethod,
          orderId: order?._id,
        },
        getAuthHeaders()
      );

      toast.success("Pago agregado correctamente");

      const paymentsRes = await axios.get(
        `${API}/api/payments?orderId=${order?._id}`,
        getAuthHeaders()
      );
      const pagos = paymentsRes.data.results || [];
      setPayments(pagos);
      const totalPagado = pagos.reduce(
        (acc: number, p: { amount: number }) => acc + p.amount,
        0
      );
      setPaid(totalPagado.toString());

      setNewAmount("");
      setNewMethod("Efectivo");
    } catch (err: any) {
      console.error("❌ Error al agregar pago:", err);
      toast.error("No se pudo agregar el pago");
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await axios.delete(`${API}/api/payments/${paymentId}`, getAuthHeaders());
      toast.success("Pago eliminado correctamente");

      // Refrescar pagos
      const paymentsRes = await axios.get(
        `${API}/api/payments?orderId=${order?._id}`,
        getAuthHeaders()
      );
      const pagos = paymentsRes.data.results || [];
      setPayments(pagos);

      const totalPagado = pagos.reduce(
        (acc: number, p: { amount: number }) => acc + p.amount,
        0
      );
      setPaid(totalPagado.toString());
    } catch (err: any) {
      console.error("❌ Error al eliminar pago:", err);
      toast.error("No se pudo eliminar el pago");
    }
  };

  if (!order) return <div className="p-6">Cargando...</div>;

  const hasChanges = status !== order.status;

  return (
    <div className="p-6">
      <Link to="/orders">
        <Button
          variant="outline"
          className="mb-4 focus:outline-none focus:ring-0"
        >
          ← Volver
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        Detalle de Orden #{order.orderId}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <OrderCustomerSection order={order} />

        <OrderSection order={order} status={status} setStatus={setStatus} />

        <OrderPaymentSection
          order={order}
          payments={payments}
          paid={paid}
          newAmount={newAmount}
          setNewAmount={setNewAmount}
          newMethod={newMethod}
          setNewMethod={setNewMethod}
          handleAddPayment={handleAddPayment}
          handleSave={handleSave}
          isSaving={isSaving}
          hasChanges={hasChanges}
          handleDeletePayment={handleDeletePayment}
        />
      </form>
    </div>
  );
};

export default OrderDetail;
