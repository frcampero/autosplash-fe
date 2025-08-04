import { CalendarDays, CreditCard, Package } from "lucide-react";

interface Props {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
}

const OrderSummaryCards = ({ totalOrders, todayOrders, totalRevenue }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-4">
        <CalendarDays className="text-blue-600" />
        <div>
          <div className="text-xl font-semibold">{todayOrders}</div>
          <div className="text-gray-500 text-sm">Tickets hoy</div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-4">
        <CreditCard className="text-green-600" />
        <div>
          <div className="text-xl font-semibold">${totalRevenue.toLocaleString()}</div>
          <div className="text-gray-500 text-sm">Ingresos totales</div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm p-4 flex items-center gap-4">
        <Package className="text-purple-600" />
        <div>
          <div className="text-xl font-semibold">{totalOrders}</div>
          <div className="text-gray-500 text-sm">Tickets totales</div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCards;
