import { useEffect, useState } from "react";
import api from "@/lib/api";
import OrderPieChart from "@/features/dashboard/components/OrderPieChart";
import TopCustomersCard from "../components/TopCustomersCard";
import DelayedOrdersCard from "../components/DelayedOrdersCard";
import DashboardKpiCards from "../components/DashboardKpiCards";
import RevenueTrendChart from "../components/RevenueTrendChart";

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [todayOrders, setTodayOrders] = useState(0);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [inProgressOrders, setInProgressOrders] = useState(0);

  useEffect(() => {
    // Datos del usuario
    api.get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("No se pudo obtener el usuario", err);
        if (err.response?.status === 401) {
          window.location.href = "/login";
        }
      });

    // Stats del dashboard
    api.get("/api/orders/stats/dashboard") 
      .then((res) => {
        const {
          todayOrders,
          ordersByStatus,
          revenueThisMonth,
          outstandingBalance,
          inProgressOrders,
        } = res.data;

        const chartFormatted = ordersByStatus.map((item: any) => ({
          estado: item._id,
          count: item.count,
        }));

        setChartData(chartFormatted);
        setTodayOrders(todayOrders);
        setRevenueThisMonth(revenueThisMonth);
        setOutstandingBalance(outstandingBalance);
        setInProgressOrders(inProgressOrders);
      })
      .catch((err) => {
        console.error("Error al cargar stats", err);
      });
  }, []);

  return (
    <div className="space-y-6">
      {user && (
        <div className="mb-2 text-sm text-gray-600">
          Hola, <span className="font-medium">{user.email}</span>
        </div>
      )}

      <DashboardKpiCards
        revenueThisMonth={revenueThisMonth}
        outstandingBalance={outstandingBalance}
        inProgressOrders={inProgressOrders}
        todayOrders={todayOrders}
      />

      {/* Grafico */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RevenueTrendChart />
        </div>
        <div className="lg:col-span-2">
          <OrderPieChart data={chartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCustomersCard />
        <DelayedOrdersCard />
      </div>
    </div>
  );
};

export default Home;