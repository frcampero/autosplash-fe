import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../lib/auth";

const API = import.meta.env.VITE_API_URL;

interface ClienteFrecuente {
  nombre: string;
  montoAbonado: number;
  cantidadPagos: number;
  ultimaFecha: string;
}

const TopCustomersCard = () => {
  const [clientes, setClientes] = useState<ClienteFrecuente[]>([]);

  useEffect(() => {
    axios
      .get(`${API}/api/customers/top`, getAuthHeaders())
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error cargando clientes:", err));
  }, []);

  return (
    <div className="bg-white rounded-md shadow-sm p-4 w-full">
      <h2 className="text-lg font-semibold mb-4">Clientes destacados por facturación</h2>
      {clientes.length === 0 ? (
        <p className="text-gray-500">No hay datos disponibles.</p>
      ) : (
        <ul className="space-y-2">
          {clientes.map((c, idx) => (
            <li
              key={idx}
              className="flex justify-between border-b py-1 text-sm text-gray-700"
            >
              <div>
                <div className="font-medium">{c.nombre}</div>
                <div className="text-xs text-gray-500">
                  {c.cantidadPagos} pagos • Último:{" "}
                  {new Date(c.ultimaFecha).toLocaleDateString()}
                </div>
              </div>
              <div className="font-semibold text-right">
                ${c.montoAbonado.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopCustomersCard;
