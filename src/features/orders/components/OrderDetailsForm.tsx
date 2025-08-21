import {
  Card,
  CardContent,
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
import { Textarea } from "@/components/ui/textarea";

interface OrderDetailsFormProps {
  form: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const OrderDetailsForm = ({
  form,
  handleChange,
  handleSelectChange,
}: OrderDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de orden</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            name="estado"
            value={form.estado}
            onValueChange={(value) => handleSelectChange("estado", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Recibido">Recibido</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de entrega</Label>
          <Select
            name="deliveryType"
            value={form.deliveryType}
            onValueChange={(value) => handleSelectChange("deliveryType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo de entrega" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="estándar">Estándar</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Nivel de cuidado</Label>
          <Select
            name="careLevel"
            value={form.careLevel}
            onValueChange={(value) => handleSelectChange("careLevel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel de cuidado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="delicado">Delicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            placeholder="Añade una descripción o notas para la orden..."
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetailsForm;