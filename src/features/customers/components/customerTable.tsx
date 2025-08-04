import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

interface Props {
  customers: Customer[];
  search: string;
}

const CustomerTable = ({ customers, search }: Props) => {
  const navigate = useNavigate();

  const filteredCustomers = customers.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.phone ?? ""} ${c.address ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!filteredCustomers.length) {
    return (
      <div className="p-4 text-gray-500">No se encontraron clientes.</div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm ">
          <thead className="bg-gray-100 text-left">
            <tr className="border-b bg-white">
              <th className="px-2 py-2 font-semibold text-gray-700">Nombre</th>
              <th className="px-2 py-2 font-semibold text-gray-700">Teléfono</th>
              <th className="px-2 py-2 font-semibold text-gray-700">Dirección</th>
              <th className="px-2 py-2 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c._id} className="border-b hover:bg-white">
                <td className="px-2 py-2">{c.firstName} {c.lastName}</td>
                <td className="px-2 py-2">{c.phone || "-"}</td>
                <td className="px-2 py-2">{c.address || "-"}</td>
                <td className="px-2 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/customers/${c._id}`)}
                  >
                    Ver perfil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;