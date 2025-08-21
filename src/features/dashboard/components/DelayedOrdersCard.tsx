import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ChevronRight, AlertTriangle } from "lucide-react";

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
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/api/orders/delayed`, getAuthHeaders())
      .then((res) => {
        setOrders(res.data.orders || []);
        setTotalCount(res.data.totalCount || 0);
      })
      .catch((err) => console.error("Error al cargar órdenes atrasadas:", err));
  }, []);

  return (
    <div className="bg-white rounded-md shadow-sm p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tickets Atrasados</h2>
        {totalCount > 0 && (
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            {totalCount} en total
          </div>
        )}
      </div>
      
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">¡Excelente! No hay tickets atrasados.</p>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3">Mostrando los 5 más antiguos. Un ticket se considera atrasado si no se ha completado en 3 días.</p>
          <ul className="space-y-2">
            {orders.map((o) => (
              <li
                key={o._id}
                onClick={() => navigate(`/orders/${o._id}`)}
                className="flex justify-between items-center border-b py-2 px-2 text-sm text-gray-700 cursor-pointer rounded transition-colors hover:bg-gray-100"
              >
                <div>
                  <div className="font-medium">{o.nombre}</div>
                  <div className="text-xs text-gray-500">
                    Ingresó hace {formatDistanceToNow(new Date(o.fecha), { locale: es })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-right font-medium">{o.estado}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DelayedOrdersCard;