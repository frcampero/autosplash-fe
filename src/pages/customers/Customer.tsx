import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${API}/api/customers`, getAuthHeaders());

        // Ajuste por si tu backend devuelve { results: [...] } o solo un array plano
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setCustomers(data || []);
      } catch (err) {
        console.error("❌ Error al cargar clientes:", err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Clientes</h1>
      <div className="bg-white rounded-md shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="px-4 py-2">
                  {c.firstName} {c.lastName}
                </td>
                <td className="px-4 py-2">{c.phone || "-"}</td>
                <td className="px-4 py-2">{c.address || "-"}</td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="focus:outline-none focus:ring-0"
                    onClick={() => navigate(`/clientes/${c._id}`)}
                  >
                    Ver perfil
                  </Button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
