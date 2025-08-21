import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  order: {
    customerId?: {
      _id: string;
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      address: string;
    };
  };
}

const OrderCustomerSection = ({ order }: Props) => {
  const navigate = useNavigate();
  const customer = order.customerId;

  if (!customer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No hay un cliente asociado a esta orden.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Cliente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-3 text-gray-500" />
          <span>
            {customer.firstName} {customer.lastName}
          </span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-3 text-gray-500" />
          <span>{customer.phone || "No especificado"}</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-3 text-gray-500" />
          <span>{customer.email || "No especificado"}</span>
        </div>
        <div className="flex items-center">
          <Home className="h-4 w-4 mr-3 text-gray-500" />
          <span>{customer.address || "No especificado"}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(`/customers/${customer._id}`)}
        >
          Ver Perfil Completo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCustomerSection;