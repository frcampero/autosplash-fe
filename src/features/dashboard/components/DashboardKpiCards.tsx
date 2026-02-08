import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const cards = [
    {
      title: "Ingresos (mes actual)",
      value: formatCurrency(revenueThisMonth),
      description: "Facturación de este mes",
      icon: DollarSign,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      title: "Saldo pendiente",
      value: formatCurrency(outstandingBalance),
      description: "Total por cobrar a clientes",
      icon: AlertCircle,
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "Órdenes en proceso",
      value: `+${inProgressOrders}`,
      description: "Actualmente en el taller",
      icon: Clock,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      title: "Órdenes de hoy",
      value: `+${todayOrders}`,
      description: "Recibidas en el día",
      icon: TrendingUp,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, description, icon: Icon, iconClass }) => (
        <Card key={title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
            >
              <Icon className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardKpiCards;
