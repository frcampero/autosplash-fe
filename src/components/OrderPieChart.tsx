import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  data: { estado: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Recibido: "#3b82f6",
  "En progreso": "#facc15",
  Completado: "#10b981",
  Entregado: "#9ca3af",
};

const OrderPieChart = ({ data }: Props) => {
  if (!data.length) {
    return <div className="text-gray-500 p-4">No hay datos para mostrar</div>;
  }

  return (
    <div className="w-full bg-white p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Tickets por estado</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="estado"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ estado, count }) => `${estado} (${count})`}
          >
            {data.map((item, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[item.estado] || "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda personalizada */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        {data.map((item) => (
          <div key={item.estado} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[item.estado] }}
            />
            <span className="text-gray-600">{item.estado}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPieChart;
