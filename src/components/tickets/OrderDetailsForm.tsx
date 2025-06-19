interface OrderDetailsFormProps {
  form: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const OrderDetailsForm = ({ form, handleChange }: OrderDetailsFormProps) => {
  return (
    <fieldset className="space-y-3 border rounded p-4">
      <legend className="text-sm font-semibold text-gray-700 mb-2">Datos de orden</legend>

      <div>
        <label className="text-sm font-medium">Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
        >
          <option value="Recibido">Recibido</option>
          <option value="En progreso">En progreso</option>
          <option value="Completado">Completado</option>
          <option value="Entregado">Entregado</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Prioridad</label>
        <select
          name="prioridad"
          value={form.prioridad}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
        >
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
          <option value="Delicado">Delicado</option>
        </select>
      </div>

      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
        required
        rows={4}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
      />

      <input
        name="nota"
        placeholder="Nota interna"
        value={form.nota}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 text-sm bg-white"
      />
    </fieldset>
  );
};

export default OrderDetailsForm;
