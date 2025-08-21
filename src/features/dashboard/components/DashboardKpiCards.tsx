import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface DashboardKpiCardsProps {
  revenueThisMonth: number;
  outstandingBalance: number;
  inProgressOrders: number;
  todayOrders: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
};

const DashboardKpiCards = ({
  revenueThisMonth,
  outstandingBalance,
  inProgressOrders,
  todayOrders,
}: DashboardKpiCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos (Mes Actual)
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(revenueThisMonth)}
          </div>
          <p className="text-xs text-muted-foreground">
            Facturación de este mes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Saldo Pendiente
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(outstandingBalance)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total por cobrar a clientes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ordenes en Proceso</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{inProgressOrders}</div>
          <p className="text-xs text-muted-foreground">
            Actualmente en el taller
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ordenes de Hoy</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{todayOrders}</div>
          <p className="text-xs text-muted-foreground">
            Recibidas en el día
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardKpiCards;