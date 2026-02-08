import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentFormProps {
  form: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  selectedItems: any[];
  isLoading: boolean;
}

const PaymentForm = ({
  form,
  handleChange,
  handleSelectChange,
  selectedItems,
  isLoading,
}: PaymentFormProps) => {
  const total = selectedItems.reduce((acc, { item, quantity }) => {
    return (
      acc +
      (item.type === "por_prenda"
        ? (item.points ?? 1) * item.price * quantity
        : item.price * quantity)
    );
  }, 0);

  const pagado = parseFloat(form.pagado || "0");
  const restante = total - pagado;

  return (
    <Card className="col-span-full md:col-span-3">
      <CardHeader>
        <CardTitle>Datos de pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pagado">Monto Pagado ($)</Label>
          <Input
            id="pagado"
            type="number"
            name="pagado"
            placeholder="0.00"
            value={form.pagado}
            onChange={handleChange}
            min="0"
            max={total}
          />
        </div>
        <div className="space-y-2">
          <Label>Método de pago</Label>
          <Select
            name="method"
            value={form.method}
            onValueChange={(value) => handleSelectChange("method", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Efectivo">Efectivo</SelectItem>
              <SelectItem value="Tarjeta de Credito">
                Tarjeta de Crédito
              </SelectItem>
              <SelectItem value="Tarjeta de debito">
                Tarjeta de Débito
              </SelectItem>
              <SelectItem value="Transferencia">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-4 bg-muted/50 p-4 rounded-b-lg">
        <div className="text-sm font-semibold text-center">
          Total: ${total.toLocaleString("es-AR")} | Pagado: $
          {pagado.toLocaleString("es-AR")} | Restante: $
          {restante.toLocaleString("es-AR")}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;