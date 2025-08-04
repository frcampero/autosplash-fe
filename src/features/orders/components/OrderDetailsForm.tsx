interface OrderDetailsFormProps {
  form: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const OrderDetailsForm = ({ form, handleChange }: OrderDetailsFormProps) => {
  return (
    <fieldset className="space-y-3 border rounded p-4">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Datos de orden
      </legend>

      <div>
        <label className="text-sm font-medium">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-0"
        >
          <option value="Recibido">Recibido</option>
          <option value="En progreso">En progreso</option>
          <option value="Completado">Completado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Tipo de entrega</label>
        <select
          name="deliveryType"
          value={form.deliveryType}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-0"
        >
          <option value="estándar">Estándar</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Nivel de cuidado</label>
        <select
          name="careLevel"
          value={form.careLevel}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-0"
        >
          <option value="normal">Normal</option>
          <option value="delicado">Delicado</option>
        </select>
      </div>

      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-0"
      />
    </fieldset>
  );
};

export default OrderDetailsForm;
