import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  PlusCircle,
  Save,
  XCircle,
  Search,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PriceItem {
  _id: string;
  name: string;
  type: "por_prenda" | "fijo";
  price: number;
  points?: number;
}

const NEW_ITEM_ID = "new-item";

const Prices = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [originalPrices, setOriginalPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPrices = () => {
    setLoading(true);
    api
      .get("/api/prices")
      .then((res) => {
        const sortedPrices = res.data.sort((a: PriceItem, b: PriceItem) =>
          a.name.localeCompare(b.name)
        );
        setPrices(sortedPrices);
        setOriginalPrices(JSON.parse(JSON.stringify(sortedPrices)));
      })
      .catch(() => toast.error("Error al cargar los precios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleChange = (
    id: string,
    field: keyof PriceItem,
    value: string | number
  ) => {
    const updated = prices.map((p) => {
      if (p._id === id) {
        const newValue =
          field === "price" || field === "points" ? Number(value) : value;
        return { ...p, [field]: newValue };
      }
      return p;
    });
    setPrices(updated);
  };

  const handleAddNew = () => {
    if (prices.find((p) => p._id === NEW_ITEM_ID)) {
      toast.info("Ya hay una fila para agregar un nuevo precio.");
      return;
    }
    const newItem: PriceItem = {
      _id: NEW_ITEM_ID,
      name: "",
      type: "por_prenda",
      price: 0,
      points: 1,
    };
    setPrices([newItem, ...prices]);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const newItem = prices.find((p) => p._id === NEW_ITEM_ID);
    const updatedItems = prices.filter(
      (p) =>
        p._id !== NEW_ITEM_ID &&
        JSON.stringify(p) !==
          JSON.stringify(originalPrices.find((op) => op._id === p._id))
    );

    try {
      if (newItem) {
        if (!newItem.name || newItem.price <= 0) {
          toast.error("El nuevo artículo debe tener nombre y precio válido.");
        } else {
          await api.post("/api/prices", { ...newItem, _id: undefined });
          toast.success("Nuevo precio creado con éxito.");
        }
      }

      if (updatedItems.length > 0) {
        await Promise.all(
          updatedItems.map((item) =>
            api.put(`/api/prices/${item._id}`, item)
          )
        );
        toast.success("Precios actualizados con éxito.");
      }

      fetchPrices();
    } catch (err) {
      toast.error("Hubo un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === NEW_ITEM_ID) {
      setPrices(prices.filter((p) => p._id !== NEW_ITEM_ID));
      return;
    }
    setSaving(true);
    try {
      await api.delete(`/api/prices/${id}`);
      toast.success("Precio eliminado correctamente.");
      fetchPrices();
    } catch (err) {
      toast.error("Error al eliminar el precio.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPrices(JSON.parse(JSON.stringify(originalPrices)));
  };

  const filteredPrices = useMemo(
    () =>
      prices.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [prices, searchTerm]
  );

  const hasChanges =
    JSON.stringify(prices) !== JSON.stringify(originalPrices);

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Precios</h2>
      </div>
      <div className="bg-card border border-border p-4 mb-4 rounded-xl shadow-sm flex flex-col sm:flex-row flex-wrap gap-4 sm:items-end">
        <div className="flex-grow w-full sm:w-auto min-w-0">
          <label htmlFor="search-price" className="block text-sm font-medium text-foreground mb-1">Buscar por prenda...</label>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-price"
              placeholder="Buscar por nombre..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleAddNew} size="sm" className="font-medium">
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir
          </Button>
        </div>
      </div>
  <Card className="shadow-md border">
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Puntos</TableHead>
                      <TableHead>Precio ($)</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrices.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              handleChange(item._id, "name", e.target.value)
                            }
                            className="bg-background"
                            placeholder="Nombre de la prenda"
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            className="w-full border border-input rounded-md px-3 py-1.5 bg-background text-foreground text-sm"
                            value={item.type}
                            onChange={(e) =>
                              handleChange(item._id, "type", e.target.value)
                            }
                          >
                            <option value="por_prenda">Por prenda</option>
                            <option value="fijo">Fijo</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {item.type === "por_prenda" && (
                            <Input
                              type="number"
                              value={item.points || ""}
                              onChange={(e) =>
                                handleChange(
                                  item._id,
                                  "points",
                                  e.target.value
                                )
                              }
                              className="bg-background"
                              placeholder="Puntos"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleChange(item._id, "price", e.target.value)
                            }
                            className="bg-background"
                            placeholder="Precio"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Estás seguro?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará
                                  permanentemente el precio de{" "}
                                  <strong>{item.name}</strong>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item._id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile View */}
              <div className="sm:hidden space-y-4">
                {filteredPrices.map((item) => (
                  <Card key={item._id}>
                    <CardHeader>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          handleChange(item._id, "name", e.target.value)
                        }
                        className="text-lg font-bold bg-transparent border-0 shadow-none pl-0"
                        placeholder="Nombre de la prenda"
                      />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo</label>
                        <select
                          className="w-full border border-input rounded-md px-3 py-1.5 bg-background text-foreground text-sm"
                          value={item.type}
                          onChange={(e) =>
                            handleChange(item._id, "type", e.target.value)
                          }
                        >
                          <option value="por_prenda">Por prenda</option>
                          <option value="fijo">Fijo</option>
                        </select>
                      </div>
                      {item.type === "por_prenda" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Puntos</label>
                          <Input
                            type="number"
                            value={item.points || ""}
                            onChange={(e) =>
                              handleChange(
                                item._id,
                                "points",
                                e.target.value
                              )
                            }
                            className="bg-background"
                            placeholder="Puntos"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Precio ($)
                        </label>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            handleChange(item._id, "price", e.target.value)
                          }
                          className="bg-background"
                          placeholder="Precio"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará
                              permanentemente el precio de{" "}
                              <strong>{item.name}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          {hasChanges && (
            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={handleCancel} disabled={saving} className="w-full sm:w-auto">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSaveAll} disabled={saving} className="w-full sm:w-auto">
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Guardar Cambios
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Prices;