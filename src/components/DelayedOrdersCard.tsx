import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../lib/auth";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

interface Order {
  _id: string;
  nombre: string;
  estado: string;
  fecha: string;
}

const DelayedOrdersCard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    axios
      .get(`${API}/api/orders/delayed`, getAuthHeaders())
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error al cargar órdenes atrasadas:", err));
  }, []);

  return (
    <div className="bg-white rounded-md shadow-sm p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Tickets atrasados</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No hay tickets atrasados.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o, idx) => (
            <li
              key={o._id}
              onClick={() => navigate(`/tickets/${o._id}`)}
              className="flex justify-between items-center border-b py-2 px-2 text-sm text-gray-700 cursor-pointer rounded transition-colors hover:bg-gray-100"
            >
              <div>
                <div className="font-medium">{o.nombre}</div>
                <div className="text-xs text-gray-500">
                  Hace {formatDistanceToNow(new Date(o.fecha), { locale: es })}{" "}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-right">{o.estado}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DelayedOrdersCard;
