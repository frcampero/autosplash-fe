import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  item: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface OrderItemsSectionProps {
  items: Item[];
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

const OrderItemsSection = ({ items }: OrderItemsSectionProps) => {
  if (!items || items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prendas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hay prendas asociadas a esta orden.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle>Prendas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Prenda</th>
                <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
                <th scope="col" className="px-6 py-3 text-right">Precio Unit.</th>
                <th scope="col" className="px-6 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ item, quantity }) => (
                <tr key={item._id} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 text-center">{quantity}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 text-right font-semibold">{formatCurrency(item.price * quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemsSection;