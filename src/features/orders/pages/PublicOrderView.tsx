import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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


  if (loading) return <div className="p-6 text-center text-gray-500">Cargando pedido...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;
  if (!data) return <div className="p-6 text-center text-red-500">Pedido no encontrado</div>;

  const { order, customer, payments } = data;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Estado del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-gray-500 mb-1">Cliente</span>
              <span className="font-medium">{customer.firstName} {customer.lastName}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Fecha</span>
              <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Estado</span>
              <span className="font-medium">{order.status}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Prioridad</span>
              <span className="font-medium">{order.priority}</span>
            </div>
            <div className="md:col-span-2">
              <span className="block text-xs text-gray-500 mb-1">Descripción</span>
              <span className="text-sm p-3 bg-gray-50 rounded-md border">{order.description}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 mb-1">Total</span>
              <span className="font-medium">${order.total}</span>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium mb-2">Pagos</span>
            {payments.length === 0 ? (
              <span className="text-sm text-muted-foreground">No hay pagos registrados</span>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-gray-700 border rounded-md p-3">
                {payments.map((p, i) => (
                  <li key={i} className="flex justify-between items-center pb-1">
                    <span className="font-semibold">${p.amount}</span>
                    <span className="text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</span>
                    <span className="ml-2">{p.method}</span>
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
