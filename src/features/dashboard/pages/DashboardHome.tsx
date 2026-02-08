import { useEffect, useState } from "react";
import api from "@/lib/api";
import OrderPieChart from "@/features/dashboard/components/OrderPieChart";
import TopCustomersCard from "../components/TopCustomersCard";
import DelayedOrdersCard from "../components/DelayedOrdersCard";
import DashboardKpiCards from "../components/DashboardKpiCards";
import RevenueTrendChart from "../components/RevenueTrendChart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [todayOrders, setTodayOrders] = useState(0);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [inProgressOrders, setInProgressOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("No se pudo obtener el usuario", err);
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      });

    api.get("/api/orders/stats/dashboard")
      .then((res) => {
        const {
          todayOrders: t,
          ordersByStatus,
          revenueThisMonth: r,
          outstandingBalance: o,
          inProgressOrders: i,
        } = res.data;

        setChartData(
          ordersByStatus.map((item: { _id: string; count: number }) => ({
            estado: item._id,
            count: item.count,
          }))
        );
        setTodayOrders(t);
        setRevenueThisMonth(r);
        setOutstandingBalance(o);
        setInProgressOrders(i);
      })
      .catch((err) => console.error("Error al cargar stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in-0 duration-300">
        <header className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </header>
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Skeleton className="lg:col-span-3 h-64 rounded-xl" />
            <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Panel de control
        </h1>
        {user && (
          <p className="text-sm text-muted-foreground">
            Bienvenido, <span className="font-medium text-foreground">{user.email}</span>
          </p>
        )}
      </header>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Resumen del mes
        </h2>
          <DashboardKpiCards
          revenueThisMonth={revenueThisMonth}
          outstandingBalance={outstandingBalance}
          inProgressOrders={inProgressOrders}
          todayOrders={todayOrders}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Actividad e ingresos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueTrendChart />
        </div>
        <div className="lg:col-span-2">
          <OrderPieChart data={chartData} />
        </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Clientes y seguimiento
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCustomersCard />
          <DelayedOrdersCard />
        </div>
      </section>
    </div>
  );
};

export default Home;