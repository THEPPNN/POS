// components/dashboard/SalesChart.tsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  export default function SalesChart({ data }: any) {
    return (
      <div className="bg-white p-4 rounded-xl shadow h-80">
        <h3 className="font-bold mb-2">ยอดขาย 7 วันล่าสุด</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="total" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }