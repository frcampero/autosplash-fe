import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TrendData {
  date: string;
  revenue: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

const RevenueTrendChart = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/orders/stats/revenue-trend")
      .then((res) => {
        const formattedData = res.data.map((item: TrendData) => ({
          ...item,
          // Formateamos la fecha para mostrarla más amigable en el gráfico
          formattedDate: format(new Date(item.date), "EEE d", { locale: es }),
        }));
        setData(formattedData);
      })
      .catch((err) => {
        console.error("Error al cargar tendencia de ingresos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ingresos de la Última Semana</CardTitle>
            </CardHeader>
            <CardContent style={{ height: '300px' }} className="flex items-center justify-center">
                <p>Cargando datos...</p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos de la Última Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} debounce={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              tickLine={false}
              axisLine={false}
              fontSize={12}
              />
            <YAxis 
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
              labelStyle={{ fontWeight: 'bold' }}
              formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={500} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueTrendChart;