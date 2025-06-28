import { Input } from "../ui/input";

interface Props {
  ticket: {
    customerId: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      address: string;
    };
  };
}

const TicketCustomerSection = ({ ticket }: Props) => {
  return (
    <fieldset className="space-y-3 border rounded p-4">
      <legend className="text-sm font-semibold text-gray-700 mb-2">
        Datos del cliente
      </legend>
      <Input
        readOnly
        value={ticket.customerId.firstName}
        placeholder="Nombre"
        className="pointer-events-none bg-gray-50 cursor-default"
      />
      <Input
        readOnly
        value={ticket.customerId.lastName}
        placeholder="Apellido"
        className="pointer-events-none bg-gray-50 cursor-default"
      />
      <Input
        readOnly
        value={ticket.customerId.phone}
        placeholder="Teléfono"
        className="pointer-events-none bg-gray-50 cursor-default"
      />
      <Input
        readOnly
        value={ticket.customerId.email}
        placeholder="Email"
        className="pointer-events-none bg-gray-50 cursor-default"
      />
      <Input
        readOnly
        value={ticket.customerId.address}
        placeholder="Dirección"
        className="pointer-events-none bg-gray-50 cursor-default"
      />
    </fieldset>
  );
};

export default TicketCustomerSection;