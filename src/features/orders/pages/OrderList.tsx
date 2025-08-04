import { useEffect, useState } from "react";
import OrderTable from "@/features/orders/components/OrderTable";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import type { Order } from "@/types/order";

const API = import.meta.env.VITE_API_URL;

registerLocale("es", es);


const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`, getAuthHeaders());
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error("❌ Error al traer las ordenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      statusFilter === "Todos" ? true : order.status === statusFilter;

    const fullName = order.customerId
      ? `${order.customerId.firstName} ${order.customerId.lastName}`.toLowerCase()
      : "";
    const matchName = fullName.includes(searchTerm.toLowerCase());

    const orderDate = new Date(order.createdAt);
    const matchStart = startDate ? orderDate >= startDate : true;
    const matchEnd = endDate ? orderDate <= endDate : true;

    return matchStatus && matchName && matchStart && matchEnd;
  });

  const clearFilters = () => {
    setStatusFilter("Todos");
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Ordenes</h2>
        <Link to="/orders/nuevo">
          <Button>+ Nueva orden</Button>
        </Link>
      </div>

      <div className="bg-white p-4 mb-4 rounded-md shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-0 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Recibido">Recibido</option>
            <option value="En progreso">En progreso</option>
            <option value="Completado">Completado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-0"
            placeholder="Buscar cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border rounded px-2 py-1 text-sm w-full bg-white focus:outline-none focus:ring-0"
              placeholderText="Elegí una fecha"
              dateFormat="dd/MM/yyyy"
              locale="es"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border rounded px-2 py-1 text-sm w-full bg-white focus:outline-none focus:ring-0"
            placeholderText="Elegí una fecha"
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </div>

        <div>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 bg-white border border-gray-200 rounded px- py-1 hover:bg-gray-50 focus:outline-none focus:ring-0"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <OrderTable
        orders={filteredOrders}
        loading={loading}
        refreshOrders={fetchOrders}
      />
    </>
  );
};

export default Orders;
