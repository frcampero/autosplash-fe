import { useEffect, useState, useCallback } from "react";
import OrderTable from "@/features/orders/components/OrderTable";
import api from "@/lib/api";
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
import { getPageRange } from "@/lib/utils";
import { useDebounce } from "@/features/customers/hooks/useDebounce";

registerLocale("es", es);

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 20;

  const fetchOrders = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/api/orders", {
          params: {
            page,
            limit: LIMIT,
            status: statusFilter === "Todos" ? undefined : statusFilter,
            search: debouncedSearch || undefined,
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
        setError("No se pudieron cargar las órdenes. Revisá la conexión e intentá de nuevo.");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, debouncedSearch, startDate, endDate]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch, startDate, endDate]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

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


  if (error) {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Órdenes</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border border-border text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchOrders(1)}>Reintentar</Button>
        </div>
      </>
    );
  }

  const from = totalOrders === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const to = Math.min(currentPage * LIMIT, totalOrders);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">Órdenes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tickets y control de pedidos.
          </p>
        </div>
        <Link to="/orders/nuevo" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">+ Nueva orden</Button>
        </Link>
      </div>

      <div className="bg-card border border-border p-4 mb-4 rounded-xl shadow-sm flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
        <div className="w-full sm:w-auto min-w-0">
          <label className="block text-sm font-medium text-foreground mb-1">
            Estado
          </label>
          <select
            className="border border-input rounded-md px-3 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer min-h-[2.25rem] w-full"
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

        <div className="w-full sm:w-auto min-w-0 flex-1 sm:flex-initial sm:min-w-[180px]">
          <label className="block text-sm font-medium text-foreground mb-1">
            Cliente
          </label>
          <input
            type="text"
            className="border border-input rounded-md px-3 py-1.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[2.25rem] w-full"
            placeholder="Buscar cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-auto min-w-0">
          <label className="block text-sm font-medium text-foreground mb-1">
            Desde
          </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="border border-input rounded-md px-3 py-1.5 text-sm w-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[2.25rem]"
              placeholderText="Elegí una fecha"
              dateFormat="dd/MM/yyyy"
              locale="es"
            />
        </div>

        <div className="w-full sm:w-auto min-w-0">
          <label className="block text-sm font-medium text-foreground mb-1">
            Hasta
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border border-input rounded-md px-3 py-1.5 text-sm w-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[2.25rem]"
            placeholderText="Elegí una fecha"
            dateFormat="dd/MM/yyyy"
            locale="es"
          />
        </div>

        <div className="w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Limpiar
          </Button>
        </div>
      </div>

      <OrderTable
        orders={orders} 
        loading={loading}
        refreshOrders={() => fetchOrders(currentPage)}
      />

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          Mostrando {from}–{to} de {totalOrders} orden{totalOrders !== 1 ? "es" : ""}
        </p>
        <div className="order-1 sm:order-2 min-w-0 w-full sm:w-auto">
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

            {getPageRange(currentPage, totalPages).map((page, idx) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <span className="px-2 text-muted-foreground">…</span>
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

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
      </div>
    </>
  );
};

export default Orders;