import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import CustomerTable from "../components/customerTable";
import { Button } from "@/components/ui/button";

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${API}/api/customers`, getAuthHeaders());
        const data = Array.isArray(res.data) ? res.data : res.data.results;
        setCustomers(data || []);
      } catch (err) {
        console.error("❌ Error al cargar clientes:", err);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const phone = c.phone?.toLowerCase() || "";
    const address = c.address?.toLowerCase() || "";
    const term = search.toLowerCase();
    return (
      fullName.includes(term) ||
      phone.includes(term) ||
      address.includes(term)
    );
  });

  const clearFilters = () => {
    setSearch("");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Clientes</h2>
        {/* Podés agregar un botón para nuevo cliente en el futuro */}
        {/* <Button>+ Nuevo cliente</Button> */}
      </div>

      <div className="bg-white p-4 mb-4 rounded-md shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre, teléfono o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-0 w-64"
          />
        </div>

        <div>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 bg-white border border-gray-200 rounded px-3 py-1 hover:bg-gray-50 focus:outline-none focus:ring-0"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <CustomerTable customers={filteredCustomers} search={search} />
    </>
  );
};

export default Customers;
