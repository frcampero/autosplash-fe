// src/components/DelayedOrdersCard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../lib/auth";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const API = import.meta.env.VITE_API_URL;

interface Order {
  nombre: string;
  estado: string;
  fecha: string;
}

const DelayedOrdersCard = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    axios
      .get(`${API}/api/orders/delayed`, getAuthHeaders())
      .then((res) => setOrders(res.data))
      .catch((err) =>
        console.error("Error al cargar órdenes atrasadas:", err)
      );
  }, []);

  return (
    <div className="bg-white rounded-md shadow-sm p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Tickets atrasados</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">No hay tikets atrasados.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b py-1 text-sm text-gray-700"
            >
              <div>
                <div className="font-medium">{o.nombre}</div>
                <div className="text-xs text-gray-500">
                  Hace {formatDistanceToNow(new Date(o.fecha), { locale: es })}{" "}
                </div>
              </div>
              <span className="text-right">{o.estado}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DelayedOrdersCard;
