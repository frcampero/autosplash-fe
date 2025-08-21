import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import CustomerTable from "../components/customerTable";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { useDebounce } from "../hooks/useDebounce";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Customer } from "@/types/customer";

const API = import.meta.env.VITE_API_URL;

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  const fetchCustomers = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: debouncedSearch,
      });
      const res = await axios.get(
        `${API}/api/customers?${params.toString()}`,
        getAuthHeaders()
      );

      setCustomers(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (err) {
      console.error("❌ Error al cargar clientes:", err);
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

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        <Button
          onClick={() => navigate("/customers/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <div className="bg-white p-4 mb-4 rounded-md shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex-grow">
          <label
            htmlFor="search-customer"
            className="block text-sm font-medium text-gray-700 mb-1"
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
        <div className="flex justify-end">
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
        loading={false}
        refreshCustomers={fetchCustomers}
      />

      {totalPages > 1 && (
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
      )}
    </>
  );
};

export default Customers;
