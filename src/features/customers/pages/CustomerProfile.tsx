import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Package,
  Calendar,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Home,
} from "lucide-react";

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
  orderId: string;
  createdAt: string;
  status: string;
  total: number;
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

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

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Cargando perfil del cliente...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center text-red-500">
        No se pudieron cargar los datos del cliente.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/customers")}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-grow">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-gray-500">Perfil del Cliente</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalSpent || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1 sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Último Pedido
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.lastOrderDate
                ? new Date(stats.lastOrderDate).toLocaleDateString()
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details and Order History */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-500 shrink-0" />
                <span>{customer.phone || "No especificado"}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-500 shrink-0" />
                <span>{customer.email || "No especificado"}</span>
              </div>
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-3 text-gray-500 shrink-0" />
                <span>{customer.address || "No especificado"}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/customers/edit/${id}`)}
              >
                Editar Cliente
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile/Tablet Card View */}
              <div className="space-y-4 md:hidden">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <Card
                      key={order._id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <CardContent className="p-4 flex justify-between items-start">
                        <div className="flex-grow">
                          <p className="font-semibold text-blue-600">
                            Orden #{order.orderId}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-lg font-bold mt-2">
                            ${order.total}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <Badge
                            className={`${getStatusBadgeClass(
                              order.status
                            )} mb-2`}
                          >
                            {order.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="py-4 text-center text-gray-500">
                    No hay pedidos registrados para este cliente.
                  </p>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">
                        Orden #
                      </th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">
                        Fecha
                      </th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">
                        Estado
                      </th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700">
                        Total
                      </th>
                      <th className="py-2 px-3 text-left font-semibold text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-3">{order.orderId}</td>
                          <td className="py-3 px-3">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              className={getStatusBadgeClass(order.status)}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">${order.total}</td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/orders/${order._id}`)}
                            >
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 px-3 text-center text-gray-500"
                        >
                          No hay pedidos registrados para este cliente.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;