import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ClienteFormProps {
  form: any;
  clientes: any[];
  handleChange: (e: React.ChangeEvent<any>) => void;
  setForm: (form: any) => void;
}

const ClienteForm = ({
  form,
  clientes,
  handleChange,
  setForm,
}: ClienteFormProps) => {
  const [open, setOpen] = useState(false);

  const selectedCliente = clientes.find(
    (c) => c._id === form.clienteExistente
  );

  const clearCliente = () => {
    setForm({
      ...form,
      clienteExistente: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  return (
    <fieldset className="space-y-3 border rounded p-4">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Datos del cliente
      </legend>

      <div>
        <label className="text-sm font-medium mb-1 block focus:outline-none focus:ring-0">Cliente existente</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between focus:outline-none focus:ring-0"
            >
              {selectedCliente
                ? `${selectedCliente.firstName} ${selectedCliente.lastName} - ${selectedCliente.phone}`
                : "-- Nuevo cliente --"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 focus:outline-none focus:ring-0 cursor-pointer" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Buscar cliente..." />
              <CommandEmpty>No se encontró cliente</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="nuevo"
                  onSelect={() => {
                    clearCliente();
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className="italic">-- Nuevo cliente --</span>
                </CommandItem>
                {clientes.map((cliente) => (
                  <CommandItem
                    key={cliente._id}
                    value={`${cliente.firstName} ${cliente.lastName} ${cliente.phone}`}
                    className="cursor-pointer"
                    onSelect={() => {
                      setForm({
                        ...form,
                        clienteExistente: cliente._id,
                      });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        form.clienteExistente === cliente._id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {cliente.firstName} {cliente.lastName} - {cliente.phone}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {!form.clienteExistente && (
        <>
          <Input
            name="firstName"
            placeholder="Nombre"
            value={form.firstName}
            onChange={handleChange}
          />
          <Input
            name="lastName"
            placeholder="Apellido"
            value={form.lastName}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="address"
            placeholder="Dirección"
            value={form.address}
            onChange={handleChange}
          />
        </>
      )}
    </fieldset>
  );
};

export default ClienteForm;
