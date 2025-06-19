import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

interface PaymentFormProps {
  form: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  selectedItems: any[];
  isLoading: boolean;
}

const PaymentForm = ({ form, handleChange, selectedItems, isLoading }: PaymentFormProps) => {
  const totalCalculado = selectedItems.reduce((acc, { item, quantity }) => {
    return acc + (item.type === "por_prenda" ? (item.points ?? 1) * item.price * quantity : item.price * quantity);
  }, 0);

  return (
    <fieldset className="space-y-3 border rounded p-4 flex flex-col justify-between col-span-full md:col-span-3">
      <legend className="text-sm font-semibold text-gray-700 mb-2">Datos de pago</legend>

      <Input
        type="number"
        name="pagado"
        placeholder="Pagado ($)"
        value={form.pagado}
        onChange={handleChange}
      />

      <div>
        <label className="text-sm font-medium">Método de pago</label>
        <select
          name="method"
          value={form.method}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta de Credito">Tarjeta de Crédito</option>
          <option value="Tarjeta de debito">Tarjeta de Débito</option>
          <option value="Transferencia">Transferencia</option>
        </select>
      </div>

      <div className="text-sm text-gray-600">
        Restante: $
        {Math.max(0, totalCalculado - parseFloat(form.pagado || "0")).toFixed(2)}
      </div>

      <Button type="submit" className="mt-6" disabled={isLoading}>
        {isLoading ? "Creando..." : "Crear ticket"}
      </Button>
    </fieldset>
  );
};

export default PaymentForm;
