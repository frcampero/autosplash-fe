import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "../lib/auth";
import ReceiptDownloadButton from "../components/ReceiptDownloadButton";

interface Ticket {
  _id: string;
  status: string;
  note: string;
  description: string;
  total: number;
  paid: number;
  priority: string;
  createdAt: string;
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

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
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
        const [ticketRes, paymentsRes] = await Promise.all([
          axios.get(`${API}/api/orders/${id}`, getAuthHeaders()),
          axios.get(`${API}/api/payments?orderId=${id}`, getAuthHeaders()),
        ]);

        setTicket(ticketRes.data);
        setStatus(ticketRes.data.status);

        const pagos = paymentsRes.data.results || [];
        setPayments(pagos);
        const totalPagado = pagos.reduce(
          (acc: number, p: { amount: number }) => acc + p.amount,
          0
        );
        setPaid(totalPagado.toString());
      } catch (err) {
        console.error("❌ Error al obtener datos del ticket y pagos:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!ticket) return;
    setIsSaving(true);

    try {
      const totalAbonado = payments.reduce((acc, p) => acc + p.amount, 0);

      if (totalAbonado > ticket.total) {
        toast.warning("Este ticket tiene pagos que superan el total estimado", {
          description: `Total: $${ticket.total} / Abonado: $${totalAbonado}`,
        });
      }

      await axios.put(
        `${API}/api/orders/${ticket._id}`,
        {
          status,
        },
        getAuthHeaders()
      );

      toast.success("Cambios guardados correctamente");
    } catch (err: any) {
      console.error("Error al guardar", err);
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Error desconocido";

      toast.error("Error al actualizar el ticket", {
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
          orderId: ticket?._id,
        },
        getAuthHeaders()
      );

      toast.success("Pago agregado correctamente");

      const paymentsRes = await axios.get(
        `${API}/api/payments?orderId=${ticket?._id}`,
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

  if (!ticket) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <Link to="/tickets">
        <Button variant="outline" className="mb-4">
          ← Volver a Tickets
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        Detalle del ticket #{ticket._id.slice(-6).toUpperCase()}
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* CLIENTE */}
        <fieldset className="space-y-3 border rounded p-4">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Datos del cliente
          </legend>
          <Input
            readOnly
            value={ticket.customerId.firstName}
            placeholder="Nombre"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
          <Input
            readOnly
            value={ticket.customerId.lastName}
            placeholder="Apellido"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
          <Input
            readOnly
            value={ticket.customerId.phone}
            placeholder="Teléfono"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
          <Input
            readOnly
            value={ticket.customerId.email}
            placeholder="Email"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
          <Input
            readOnly
            value={ticket.customerId.address}
            placeholder="Dirección"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
        </fieldset>

        {/* PEDIDO */}
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
            value={ticket.priority}
            placeholder="Prioridad"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
          <textarea
            readOnly
            value={ticket.description}
            rows={4}
            className="w-full border rounded px-3 py-2 text-sm bg-gray-50 pointer-events-none cursor-default"
          />
          <Input
            readOnly
            value={ticket.note}
            placeholder="Nota interna"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
          <Input
            readOnly
            value={new Date(ticket.createdAt).toLocaleDateString()}
            placeholder="Fecha"
            className="pointer-events-none bg-gray-50 cursor-default"
          />
        </fieldset>

        {/* PAGOS */}
        <fieldset className="space-y-3 border rounded p-4 flex flex-col justify-between">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Estado de pago
          </legend>
          {(() => {
            const totalAbonado = payments.reduce((acc, p) => acc + p.amount, 0);
            const restante = Math.max(ticket.total - totalAbonado, 0).toFixed(
              2
            );
            const estadoPago =
              totalAbonado >= ticket.total
                ? "Pagado"
                : totalAbonado > 0
                ? "Parcial"
                : "Pendiente";
            const ultimoMetodo =
              payments.length > 0 ? payments[0].method : "Sin pagos aún";

            return (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Total:</p>
                  <Input
                    readOnly
                    value={ticket.total.toString()}
                    className="pointer-events-none bg-gray-50 cursor-default"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Abonado:</p>
                  <div className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-sm text-gray-700">
                    ${Number(paid).toFixed(2)}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Restante: ${restante}
                </div>
                <div className="text-sm">
                  Estado de pago:{" "}
                  <span className={getPaymentStatusClass(estadoPago)}>
                    {estadoPago}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Último método de pago: <strong>{ultimoMetodo}</strong>
                </p>

                {/* Historial */}
                {payments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Historial de pagos
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {payments.map((p) => (
                        <li
                          key={p._id}
                          className="flex justify-between border-b pb-1"
                        >
                          <span>${p.amount.toFixed(2)}</span>
                          <span>{p.method}</span>
                          <span className="text-gray-500">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-2">
                  Días desde creación:{" "}
                  {Math.floor(
                    (Date.now() - new Date(ticket.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  días
                </p>

                {/* NUEVO PAGO */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Agregar nuevo pago
                  </h4>
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
                      <option value="Tarjeta de Credito">
                        Tarjeta de Crédito
                      </option>
                      <option value="Tarjeta de debito">
                        Tarjeta de Débito
                      </option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                    <Button type="button" onClick={handleAddPayment}>
                      Agregar
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="mt-6" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </>
            );
          })()}
          <ReceiptDownloadButton orderId={ticket._id} />
        </fieldset>
      </form>
    </div>
  );
};

export default TicketDetail;
