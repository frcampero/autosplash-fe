import { Input } from "../../components/ui/input";

interface ClienteFormProps {
  form: any;
  clientes: any[];
  handleChange: (e: React.ChangeEvent<any>) => void;
  setForm: (form: any) => void;
}

const ClienteForm = ({ form, clientes, handleChange, setForm }: ClienteFormProps) => {
  return (
    <fieldset className="space-y-3 border rounded p-4">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Datos del cliente
      </legend>

      <div>
        <label className="text-sm font-medium">Cliente existente</label>
        <select
          name="clienteExistente"
          value={form.clienteExistente}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
        >
          <option value="">-- Nuevo cliente --</option>
          {clientes.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.firstName} {c.lastName} - {c.phone}
            </option>
          ))}
        </select>
      </div>

      {!form.clienteExistente && (
        <>
          <Input name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} />
          <Input name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} />
          <Input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} />
        </>
      )}
    </fieldset>
  );
};

export default ClienteForm;
