import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { toast } from "sonner";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import type { Customer } from "@/types/customer";

interface Props {
  customers: Customer[];
  loading: boolean;
  refreshCustomers: () => void;
}

const CustomerTable = ({ customers, loading, refreshCustomers }: Props) => {
  const navigate = useNavigate();

  if (loading) return <div className="p-4">Cargando clientes...</div>;

  if (!customers.length) {
    return (
      <div className="p-4 text-center text-gray-500 bg-white rounded-md shadow-sm">
        <p>No se encontraron clientes.</p>
        <p className="text-sm">Puedes agregar un nuevo cliente para empezar.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/customers/${id}`,
        getAuthHeaders()
      );
      toast.success("Cliente eliminado correctamente");
      refreshCustomers();
    } catch (error: any) {
      const mensaje =
        error.response?.data?.error || "Error al eliminar el cliente";
      console.error("❌ Error al eliminar el cliente:", mensaje);
      toast.error(mensaje);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm">
      {/* --- Vista de Tabla (Desktop) --- */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-semibold text-gray-700">
                Nombre
              </th>
              <th className="text-left py-2 px-4 font-semibold text-gray-700">
                Teléfono
              </th>
              <th className="text-left py-2 px-4 font-semibold text-gray-700">
                Dirección
              </th>
              <th className="text-left py-2 px-4 font-semibold text-gray-700 w-[100px]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
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
                    <DropdownMenuContent
                      align="end"
                      className="bg-white text-gray-900 border-gray-200 shadow-md"
                    >
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
            className="border-b p-4 space-y-3 bg-white"
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
                <DropdownMenuContent
                  align="end"
                  className="bg-white text-gray-900 border-gray-200 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
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
                <p className="text-gray-500">Teléfono</p>
                <p>{c.phone || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Dirección</p>
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