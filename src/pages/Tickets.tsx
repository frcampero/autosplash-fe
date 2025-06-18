// src/pages/Tickets.tsx
import { useEffect, useState } from "react";
import TicketTable from "../components/TicketTable";
import axios from "axios";
import { getAuthHeaders } from "../lib/auth";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const API = import.meta.env.VITE_API_URL;

export interface Ticket {
  _id: string;
  customerId?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  status: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/api/orders`, getAuthHeaders());
      setTickets(res.data.results || res.data);
    } catch (err) {
      console.error("❌ Error al traer tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchStatus =
      statusFilter === "Todos" ? true : ticket.status === statusFilter;

    const fullName = ticket.customerId
      ? `${ticket.customerId.firstName} ${ticket.customerId.lastName}`.toLowerCase()
      : "";
    const matchName = fullName.includes(searchTerm.toLowerCase());

    const ticketDate = new Date(ticket.createdAt);
    const matchStart = startDate ? ticketDate >= new Date(startDate) : true;
    const matchEnd = endDate ? ticketDate <= new Date(endDate) : true;

    return matchStatus && matchName && matchStart && matchEnd;
  });

  const clearFilters = () => {
    setStatusFilter("Todos");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <Link to="/tickets/nuevo">
          <Button>+ Crear ticket</Button>
        </Link>
      </div>

      <div className="bg-white p-4 mb-4 rounded-md shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            className="border rounded px-2 py-1 text-sm bg-white"
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
            className="border rounded px-2 py-1 text-sm bg-white"
            placeholder="Buscar cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">
            Desde
          </label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm bg-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm bg-white"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 bg-white border border-gray-200 rounded px- py-1 hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <TicketTable
        tickets={filteredTickets}
        loading={loading}
        refreshTickets={fetchTickets}
      />
    </>
  );
};

export default Tickets;
