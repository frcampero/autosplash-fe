import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
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
import { Plus, UserCog } from "lucide-react";
import type { User, UserListResponse } from "@/types/user";
import { TableSkeleton } from "@/components/TableSkeleton";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";
import type { AxiosError } from "axios";

const LIMIT = 10;
const ROLE_LABEL: Record<string, string> = { admin: "Administrador", editor: "Editor" };

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get<UserListResponse>("/api/users", {
        params: { page: currentPage, limit: LIMIT },
      });
      setUsers(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
      setTotalUsers(res.data.totalUsers ?? 0);
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      if (axiosErr.response?.status === 403) {
        setError("No tenés permisos para ver esta sección.");
      } else {
        setError("No se pudieron cargar los usuarios. Revisá la conexión e intentá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleDelete = async (id: string, email: string) => {
    try {
      await api.delete(`/api/users/${id}`);
      toast.success("Usuario eliminado correctamente");
      fetchUsers();
    } catch (e) {
      const err = e as AxiosError<{ error?: string }>;
      toast.error(err.response?.data?.error || "Error al eliminar el usuario");
    }
  };

  if (error) {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border border-border text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchUsers()}>Reintentar</Button>
        </div>
      </>
    );
  }

  const from = totalUsers === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const to = Math.min(currentPage * LIMIT, totalUsers);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Administrá usuarios y roles.</p>
          </div>
        </div>
        <TableSkeleton rows={6} columns={5} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administrá usuarios, roles e imagen de perfil.
          </p>
        </div>
        <Button onClick={() => navigate("/users/new")} className="w-full sm:w-auto shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo usuario
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card rounded-xl border border-border text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <UserCog className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No hay usuarios</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Creá el primer usuario para dar acceso al sistema.
          </p>
          <Button onClick={() => navigate("/users/new")}>+ Nuevo usuario</Button>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Desktop: tabla */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-semibold text-foreground w-12"> </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Rol</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground w-24">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs">
                          {(u.firstName?.[0] || "") + (u.lastName?.[0] || "")}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {ROLE_LABEL[u.role] || u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/users/edit/${u._id}`)}>
                            Editar
                          </DropdownMenuItem>
                          <DeleteConfirmationDialog
                            onConfirm={() => handleDelete(u._id, u.email)}
                            itemName={u.email}
                            itemType="usuario"
                          >
                            <div className="cursor-pointer text-red-600 hover:bg-red-50 px-2 py-1.5 text-sm">
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
          {/* Mobile: cards */}
          <div className="md:hidden divide-y divide-border">
            {users.map((u) => (
              <div
                key={u._id}
                className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/users/edit/${u._id}`)}
              >
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                    {(u.firstName?.[0] || "") + (u.lastName?.[0] || "")}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mt-1">
                    {ROLE_LABEL[u.role] || u.role}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="icon" className="h-8 w-8 p-0 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/users/edit/${u._id}`)}>
                      Editar
                    </DropdownMenuItem>
                    <DeleteConfirmationDialog
                      onConfirm={() => handleDelete(u._id, u.email)}
                      itemName={u.email}
                      itemType="usuario"
                    >
                      <div className="cursor-pointer text-red-600 hover:bg-red-50 px-2 py-1.5 text-sm">
                        Eliminar
                      </div>
                    </DeleteConfirmationDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      )}

      {(totalPages > 1 || totalUsers > 0) && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Mostrando {from}–{to} de {totalUsers} usuario{totalUsers !== 1 ? "s" : ""}
          </p>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {getPageRange(currentPage, totalPages).map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`e-${idx}`}>
                      <span className="px-2 text-muted-foreground">…</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </>
  );
};

export default Users;
