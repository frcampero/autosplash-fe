// src/components/TicketTable.tsx
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { Ticket } from "../pages/Tickets";

interface Props {
  tickets: Ticket[];
  loading: boolean;
  refreshTickets: () => void;
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

const TicketTable = ({ tickets, loading }: Props) => {
  if (loading) return <div className="p-4">Cargando tickets...</div>;

  if (!tickets.length) {
    return <div className="p-4 text-gray-500">No hay tickets aún. </div>;
  }

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-2 font-semibold text-gray-700">
              Ticket #
            </th>
            <th className="text-left py-2 px-2 font-semibold text-gray-700">
              Cliente
            </th>
            <th className="text-left py-2 px-2 font-semibold text-gray-700">
              Fecha
            </th>
            <th className="text-left py-2 px-2 font-semibold text-gray-700">
              Estado
            </th>
            <th className="text-left py-2 px-2 font-semibold text-gray-700">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id} className="border-b hover:bg-white">
              <td className="py-2 px-2">
                {ticket._id.slice(-6).toUpperCase()}
              </td>
              <td className="py-2 px-2">
                {ticket.customerId
                  ? `${ticket.customerId.firstName} ${ticket.customerId.lastName}`
                  : "Cliente desconocido"}
              </td>
              <td className="py-2 px-2">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>
              <td className="py-2 px-2">
                <Badge className={getStatusBadgeClass(ticket.status)}>
                  {ticket.status}
                </Badge>
              </td>
              <td className="py-2 px-2 space-x-2">
                <Link to={`/tickets/${ticket._id}`}>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTable;
