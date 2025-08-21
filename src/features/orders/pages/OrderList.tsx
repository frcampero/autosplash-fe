import { useEffect, useState } from "react";
import OrderTable from "@/features/orders/components/OrderTable";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import type { Order } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const API = import.meta.env.VITE_API_URL;

registerLocale("es", es);

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // --- Estados de paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/orders`, {
        ...getAuthHeaders(),
        params: {
          page,
          limit: 20,
          status: statusFilter === "Todos" ? undefined : statusFilter,
          search: searchTerm || undefined,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });

      
      setOrders(res.data.docs || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
      setTotalOrders(res.data.totalDocs || 0);
    } catch (err) {
      console.error("❌ Error al traer las ordenes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, statusFilter, searchTerm, startDate, endDate]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const clearFilters = () => {
    setStatusFilter("Todos");
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };


  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Órdenes ({totalOrders} en total)
        </h2>
        <Link to="/orders/nuevo">
          <Button>+ Nueva orden</Button>
        </Link>
      </div>

      <div className="bg-white p-4 mb-4 rounded-md shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-0 cursor-pointer"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); 
            }}
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
            className="border rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-0"
            placeholder="Buscar cliente"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm w-full bg-white focus:outline-none focus:ring-0"
              placeholderText="Elegí una fecha"
              dateFormat="dd/MM/yyyy"
              locale="es"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm w-full bg-white focus:outline-none focus:ring-0"
            placeholderText="Elegí una fecha"
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </div>

        <div>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 bg-white border border-gray-200 rounded px-3 py-1 hover:bg-gray-50 focus:outline-none focus:ring-0"
          >
            Limpiar
          </button>
        </div>
      </div>

      <OrderTable
        orders={orders} 
        loading={loading}
        refreshOrders={() => fetchOrders(currentPage)}
      />

      {/* --- Componente de Paginación --- */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* Números de página */}
            {[...Array(totalPages).keys()].map((page) => (
              <PaginationItem key={page + 1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Orders;