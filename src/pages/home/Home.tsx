import { useEffect, useState } from "react";
import axios from "axios";
import OrderSummaryCards from "@/components/OrderSummaryCards";
import { getAuthHeaders } from "@/lib/auth";
import OrderPieChart from "@/components/OrderPieChart";
import TopCustomersCard from "@/components/TopCustomersCard";
import DelayedOrdersCard from "@/components/DelayedOrdersCard";

const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    axios
      .get(`${API}/api/orders/stats/dashboard`, getAuthHeaders())
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
      <OrderSummaryCards
        totalOrders={totalOrders}
        todayOrders={todayOrders}
        totalRevenue={totalRevenue}
      />
      <OrderPieChart data={chartData} />
      <TopCustomersCard />
      <DelayedOrdersCard/>
    </div>
  );
};

export default Home;
