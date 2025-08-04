import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const API = import.meta.env.VITE_API_URL;

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  status: string;
  total: number;
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, ordersRes, statsRes] = await Promise.all([
          axios.get(`${API}/api/customers/${id}`, getAuthHeaders()),
          axios.get(`${API}/api/orders/customer/${id}`, getAuthHeaders()),
          axios.get(`${API}/api/customers/${id}/stats`, getAuthHeaders()),
        ]);

        setCustomer(customerRes.data);
        const data = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : ordersRes.data.results;
        setOrders(data || []);
        setStats(statsRes.data);
      } catch (err: any) {
        console.error("Error cargando datos:", err.response?.data || err);
      }
    };

    fetchData();
  }, [id]);

  if (!customer)
    return <div className="p-6">Cargando datos del cliente...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link to="/customers">
          <Button
            variant="outline"
            className="mb-4 focus:outline-none focus:ring-0"
          >
            ← Volver
          </Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold">
        {customer.firstName} {customer.lastName}
      </h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p>📞 Teléfono: {customer.phone || "No especificado"}</p>
        <p>📧 Email: {customer.email || "No especificado"}</p>
        <p>🏠 Dirección: {customer.address || "No especificado"}</p>
        <div className="mt-10">
          <Link to={`/customers/edit/${id}`} className="text-blue-600">
            Editar datos
          </Link>
        </div>
      </div>

      {stats && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Resumen</h2>
          <p>Total de Ordenes: {stats.totalOrders}</p>
          <p>Total gastado: ${stats.totalSpent}</p>
          <p>
            Último pedido: {new Date(stats.lastOrderDate).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Historial de pedidos</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Fecha</th>
              <th className="py-2 text-left">Estado</th>
              <th className="py-2 text-left">Total</th>
              <th className="py-2 text-left">Ver</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((t) => (
              <tr key={t._id} className="border-b">
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>{t.status}</td>
                <td>${t.total}</td>
                <td>
                  <Link to={`/orders/${t._id}`} className="text-blue-500">
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="py-2 text-gray-500">
                  No hay pedidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerProfile;
