import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { TableSkeleton } from "@/components/TableSkeleton";
import type { Customer } from "@/types/customer";

interface Props {
  customers: Customer[];
  loading: boolean;
  refreshCustomers: () => void;
}

const CustomerTable = ({ customers, loading, refreshCustomers }: Props) => {
  const navigate = useNavigate();

  if (loading) return <TableSkeleton rows={6} columns={4} />;

  if (!customers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-lg border border-border text-center animate-in fade-in-0 duration-300">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          No hay clientes
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Agregá tu primer cliente para poder asignarle órdenes y llevar el historial.
        </p>
        <Button asChild>
          <Link to="/customers/new">+ Nuevo cliente</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/customers/${id}`);
      toast.success("Cliente eliminado correctamente");
      refreshCustomers();
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>;
      const mensaje =
        err.response?.data?.error || "Error al eliminar el cliente";
      console.error("❌ Error al eliminar el cliente:", mensaje);
      toast.error(mensaje);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* --- Vista de Tabla (Desktop) --- */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Nombre
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Teléfono
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground">
                Dirección
              </th>
              <th className="text-left py-2 px-4 font-semibold text-foreground w-[100px]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-2 px-4 font-medium">
                  {c.firstName} {c.lastName}
                </td>
                <td className="py-2 px-4">{c.phone || "-"}</td>
                <td className="py-2 px-4">{c.address || "-"}</td>
                <td className="py-2 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => navigate(`/customers/${c._id}`)}
                        className="cursor-pointer"
                      >
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => navigate(`/customers/edit/${c._id}`)}
                        className="cursor-pointer"
                      >
                        Editar
                      </DropdownMenuItem>
                      <DeleteConfirmationDialog
                        onConfirm={() => handleDelete(c._id)}
                        itemName={`${c.firstName} ${c.lastName}`}
                        itemType="cliente"
                      >
                        <div className="cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50">
                          Eliminar
                        </div>
                      </DeleteConfirmationDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Vista Mobile --- */}
      <div className="md:hidden">
        {customers.map((c) => (
          <div
            key={c._id}
            className="border-b p-4 space-y-3 bg-card"
            onClick={() => navigate(`/customers/${c._id}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-base">
                  {c.firstName} {c.lastName}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onSelect={() => navigate(`/customers/${c._id}`)}
                  >
                    Ver Detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => navigate(`/customers/edit/${c._id}`)}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DeleteConfirmationDialog
                    onConfirm={() => handleDelete(c._id)}
                    itemName={`${c.firstName} ${c.lastName}`}
                    itemType="cliente"
                  >
                    <div className="cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-50">
                      Eliminar
                    </div>
                  </DeleteConfirmationDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Teléfono</p>
                <p>{c.phone || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dirección</p>
                <p className="truncate">{c.address || "-"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerTable;
