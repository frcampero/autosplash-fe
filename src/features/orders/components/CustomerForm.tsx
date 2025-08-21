import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Datos del cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cliente existente</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCliente
                  ? `${selectedCliente.firstName} ${selectedCliente.lastName} - ${selectedCliente.phone}`
                  : "-- Nuevo cliente --"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>No se encontró cliente.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="nuevo"
                      onSelect={() => {
                        clearCliente();
                        setOpen(false);
                      }}
                    >
                      <span className="italic">-- Nuevo cliente --</span>
                    </CommandItem>
                    {clientes.map((cliente) => (
                      <CommandItem
                        key={cliente._id}
                        value={`${cliente.firstName} ${cliente.lastName} ${cliente.phone}`}
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
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {!form.clienteExistente && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName">Nombre</label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Juan"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName">Apellido</label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Rodriguez"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone">Teléfono</label>
              <Input
                id="phone"
                name="phone"
                placeholder="1122334455"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="test@ejemplo.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address">Dirección</label>
              <Input
                id="address"
                name="address"
                placeholder="Av. San Martin 123"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClienteForm;
