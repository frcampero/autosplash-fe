import { useEffect, useState } from "react";
import api from "@/lib/api";
import OrderSummaryCards from "@/features/dashboard/components/OrderSummaryCards";
import OrderPieChart from "@/features/dashboard/components/OrderPieChart";
import TopCustomersCard from "../components/TopCustomersCard";
import DelayedOrdersCard from "../components/DelayedOrdersCard";

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [user, setUser] = useState<{ email: string } | null>(null);

useEffect(() => {
  // Datos del usuario
  api
    .get("/api/auth/me")
    .then((res) => setUser(res.data))
    .catch((err) => {
      console.error("No se pudo obtener el usuario", err);
      if (err.response?.status === 401) {
        // Sesión vencida → redirigir al login
        window.location.href = "/login";
      }
    });

  // Stats
  api
    .get("/api/orders/stats/dashboard")
    .then((res) => {
      const { totalOrders, todayOrders, totalRevenue, ordersByStatus } =
        res.data;

      const chartFormatted = ordersByStatus.map((item: any) => ({
        estado: item._id,
        count: item.count,
      }));

      setChartData(chartFormatted);
      setTotalOrders(totalOrders);
      setTodayOrders(todayOrders);
      setTotalRevenue(totalRevenue);
    })
    .catch((err) => {
      console.error("Error al cargar stats", err);
    });
}, []);


  return (
    <div className="space-y-4">
      {user && (
        <div className="mb-2 text-sm text-gray-600">
          Hola, <span className="font-medium">{user.email}</span>
        </div>
      )}
      <OrderSummaryCards
        totalOrders={totalOrders}
        todayOrders={todayOrders}
        totalRevenue={totalRevenue}
      />
      <OrderPieChart data={chartData} />
      <TopCustomersCard />
      <DelayedOrdersCard />
    </div>
  );
};

export default Home;
