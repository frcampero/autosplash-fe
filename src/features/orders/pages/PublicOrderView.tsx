import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

type PublicOrderType = {
  order: {
    _id: string;
    description: string;
    status: string;
    priority: string;
    total: number;
    createdAt: string;
  };
  customer: {
    firstName: string;
    lastName: string;
  };
  payments: {
    amount: number;
    method: string;
    createdAt: string;
  }[];
};

const API = import.meta.env.VITE_API_URL;

const PublicOrderPage = () => {
  const { orderId } = useParams();
  const [data, setData] = useState<PublicOrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API}/api/public/orders/${orderId}`);
        setData(res.data);
      } catch (err) {
        setError("No se pudo cargar la orden");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Cargando pedido...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Pedido no encontrado</p>;

  const { order, customer, payments } = data;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Estado del Pedido</h1>
      <Card>
        <CardContent className="space-y-3 p-6">
          <p>
            <strong>Cliente:</strong> {customer.firstName} {customer.lastName}
          </p>
          <p>
            <strong>Descripción:</strong> {order.description}
          </p>
          <p>
            <strong>Estado:</strong> {order.status}
          </p>
          <p>
            <strong>Prioridad:</strong> {order.priority}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Total:</strong> ${order.total}
          </p>

          <div className="mt-4">
            <h2 className="font-semibold">Pagos</h2>
            {payments.length === 0 ? (
              <p>No hay pagos registrados</p>
            ) : (
              <ul className="list-disc pl-5">
                {payments.map((p, i) => (
                  <li key={i}>
                    ${p.amount} - {p.method} -{" "}
                    {new Date(p.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicOrderPage;
