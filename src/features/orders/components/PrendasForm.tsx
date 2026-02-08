import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface PrendasFormProps {
  priceItems: any[];
  selectedItems: any[];
  setSelectedItems: (items: any[]) => void;
}

const PrendasForm = ({
  priceItems,
  selectedItems,
  setSelectedItems,
}: PrendasFormProps) => {
  const [selectedValue, setSelectedValue] = useState("");

  const totalCalculado = selectedItems.reduce((acc, { item, quantity }) => {
    return (
      acc +
      (item.type === "por_prenda"
        ? (item.points ?? 1) * item.price * quantity
        : item.price * quantity)
    );
  }, 0);

  const handleAddPrenda = () => {
    if (!selectedValue) return;

    const selected = priceItems.find((i) => i._id === selectedValue);
    if (!selected) return;

    const alreadyAdded = selectedItems.some(
      (i) => i.item._id === selectedValue
    );
    if (alreadyAdded) {
      toast.warning("Esta prenda ya fue agregada.");
      return;
    }

    setSelectedItems([...selectedItems, { item: selected, quantity: 1 }]);
    setSelectedValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Select + Botón */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger className="w-full sm:flex-1">
                <SelectValue placeholder="Seleccionar prenda..." />
              </SelectTrigger>
              <SelectContent>
                {priceItems.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name} (
                    {item.type === "por_prenda"
                      ? `${item.points}P`
                      : `$${item.price}`}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="button" onClick={handleAddPrenda} className="w-full sm:w-auto sm:ml-auto">
              Agregar
            </Button>
          </div>

          {/* Lista de prendas */}
          <div className="space-y-2">
            {selectedItems.map(({ item, quantity }, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 bg-muted/50 p-3 sm:p-2 rounded-lg"
              >
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{item.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <Input
                    type="number"
                    min={1}
                    className="h-8 w-16 text-center"
                    value={quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updated = [...selectedItems];
                      updated[index].quantity = Number(e.target.value);
                      setSelectedItems(updated);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    type="button"
                    onClick={() => {
                      const updated = [...selectedItems];
                      updated.splice(index, 1);
                      setSelectedItems(updated);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end bg-muted/50 p-4 rounded-b-lg">
        <p className="text-lg font-semibold">
          Total: ${totalCalculado.toFixed(2)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PrendasForm;