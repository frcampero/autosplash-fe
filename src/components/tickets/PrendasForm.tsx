import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

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
    <fieldset className="border rounded p-4 flex flex-col h-full">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Prendas del ticket
      </legend>

      {/* Select + Botón */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        <select
          className="border rounded px-3 py-2 text-sm bg-white text-gray-800 w-full"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="">Seleccionar prenda...</option>
          {priceItems.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} (
              {item.type === "por_prenda"
                ? `${item.points}P`
                : `$${item.price}`}
              )
            </option>
          ))}
        </select>

        <Button type="button" onClick={handleAddPrenda}>
          Agregar
        </Button>
      </div>

      {/* Lista de prendas */}
      <div className="grid grid-cols-1 gap-2 mt-2 mb-2">
        {selectedItems.map(({ item, quantity }, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center bg-gray-50 p-2 rounded"
          >
            <div className="flex items-center justify-between gap-2 col-span-2">
              <span className="text-sm">{item.name}</span>
              <input
                type="number"
                min={1}
                className="border rounded text-center bg-white w-10"
                value={quantity}
                onChange={(e) => {
                  const updated = [...selectedItems];
                  updated[index].quantity = Number(e.target.value);
                  setSelectedItems(updated);
                }}
              />
            </div>

            <button
              className="text-red-500 text-xs bg-white border border-red-300 rounded px-2 py-1 hover:bg-red-50 hover:border-red-500 focus:outline-none w-full col-span-1"
              type="button"
              onClick={() => {
                setSelectedItems(selectedItems.filter((_, i) => i !== index));
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {/* Total calculado fijo al fondo */}
      <div className="text-sm text-gray-600 text-right mt-auto pt-4 border-t border-gray-200">
        Total calculado: ${totalCalculado}
      </div>
    </fieldset>
  );
};

export default PrendasForm;
