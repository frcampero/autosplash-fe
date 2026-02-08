import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import CustomerTable from "../components/CustomerTable";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { getPageRange } from "@/lib/utils";
import { useDebounce } from "../hooks/useDebounce";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/types/customer";

const LIMIT = 10;

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  const fetchCustomers = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: String(LIMIT),
        search: debouncedSearch,
      });
      const res = await api.get(`/api/customers?${params.toString()}`);

      setCustomers(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
      setTotalCustomers(res.data.totalCustomers ?? 0);
    } catch (err) {
      console.error("❌ Error al cargar clientes:", err);
      setError("No se pudieron cargar los clientes. Revisá la conexión e intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (error) {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border border-border text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchCustomers()}>Reintentar</Button>
        </div>
      </>
    );
  }

  const from = totalCustomers === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const to = Math.min(currentPage * LIMIT, totalCustomers);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestioná contactos y historial de pagos.
          </p>
        </div>
        <Button
          onClick={() => navigate("/customers/new")}
          className="w-full sm:w-auto shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <div className="bg-card border border-border p-4 mb-4 rounded-xl shadow-sm flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
        <div className="flex-grow w-full sm:w-auto min-w-0">
          <label
            htmlFor="search-customer"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Buscar cliente
          </label>
          <Input
            id="search-customer"
            type="text"
            placeholder="Nombre, teléfono, email o dirección..."
            value={search}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end w-full sm:w-auto">
          <Button
            onClick={clearFilters}
            variant="outline"
          >
            Limpiar
          </Button>
        </div>
      </div>

      <CustomerTable
        customers={customers}
        loading={loading}
        refreshCustomers={fetchCustomers}
      />

      {(totalPages > 1 || totalCustomers > 0) && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Mostrando {from}–{to} de {totalCustomers} cliente{totalCustomers !== 1 ? "s" : ""}
          </p>
          <div className="order-1 sm:order-2">
          {totalPages > 1 && (
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
          )}
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
