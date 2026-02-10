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
    <div className="mb-4">
      <div className="bg-white p-4 rounded-xl shadow h-80">
        <h3 className="font-bold mb-2">ยอดขาย 7 วันล่าสุด</h3>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 20, // 👈 สำคัญ แก้ชิดขอบล่าง
            }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickMargin={10} // 👈 ดัน label ออกจากเส้น
            />
            <YAxis
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}          // จุดเล็ก ๆ ดูชัด
              activeDot={{ r: 6 }}    // ตอน hover
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}