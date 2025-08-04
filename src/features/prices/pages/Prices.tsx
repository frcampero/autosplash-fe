import { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;

interface PriceItem {
  _id: string;
  name: string;
  type: "por_prenda" | "fijo";
  price: number;
  points?: number;
}

const Prices = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [originalPrices, setOriginalPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/prices`, getAuthHeaders())
      .then((res) => {
        setPrices(res.data);
        setOriginalPrices(JSON.parse(JSON.stringify(res.data)));
      })
      .catch(() => toast.error("Error al cargar los precios"));
  }, []);

  const handleChange = (
    index: number,
    field: keyof PriceItem,
    value: string | number
  ) => {
    const updated = [...prices];
    // @ts-ignore
    updated[index][field] =
      field === "price" || field === "points" ? Number(value) : value;
    setPrices(updated);
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      await Promise.all(
        prices.map((item) =>
          axios.put(`${API}/api/prices/${item._id}`, item, getAuthHeaders())
        )
      );
      toast.success("Todos los precios fueron actualizados");
      setOriginalPrices(JSON.parse(JSON.stringify(prices)));
    } catch (err) {
      toast.error("Hubo un error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = JSON.stringify(prices) !== JSON.stringify(originalPrices);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Gestión de precios</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Puntos</th>
              <th className="p-2 border">Precio ($)</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item, i) => (
              <tr key={item._id} className="even:bg-gray-50">
                <td className="p-2 border bg'white">
                  <Input
                    value={item.name}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                    className="bg-white"
                  />
                </td>
                <td className="p-2 border">
                  <select
                    className="w-full border rounded px-2 py-1 bg-white"
                    value={item.type}
                    onChange={(e) => handleChange(i, "type", e.target.value)}
                  >
                    <option value="por_prenda">Por prenda</option>
                    <option value="fijo">Fijo</option>
                  </select>
                </td>
                <td className="p-2 border">
                  <Input
                    type="number"
                    value={item.points || ""}
                    onChange={(e) => handleChange(i, "points", e.target.value)}
                    disabled={item.type !== "por_prenda"}
                    className="bg-white"
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleChange(i, "price", e.target.value)}
                    className="bg-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <Button onClick={handleSaveAll} disabled={!hasChanges || loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
};

export default Prices;
