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

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Tickets</h2>
        <Link to="/tickets/nuevo">
          <Button>+ Crear ticket</Button>
        </Link>
      </div>
      <TicketTable tickets={tickets} loading={loading} refreshTickets={fetchTickets} />
    </>
  );
};

export default Tickets;