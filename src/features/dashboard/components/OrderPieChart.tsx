import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  data: { estado: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Recibido: "hsl(207, 24%, 53%)",
  "En progreso": "hsl(45, 93%, 47%)",
  Completado: "hsl(160, 84%, 39%)",
  Entregado: "hsl(210, 10%, 55%)",
};

const OrderPieChart = ({ data }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets por estado</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución actual de órdenes
        </p>
      </CardHeader>
      <CardContent>
        {!data.length ? (
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
            <p className="text-sm text-muted-foreground">No hay datos para mostrar</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="estado"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  label={({ estado, count }) => `${estado} (${count})`}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[item.estado] ?? "hsl(var(--muted-foreground))"}
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value} ticket${value !== 1 ? "s" : ""}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {data.map((item) => (
                <div key={item.estado} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[item.estado] }}
                  />
                  <span className="text-muted-foreground">{item.estado}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderPieChart;
