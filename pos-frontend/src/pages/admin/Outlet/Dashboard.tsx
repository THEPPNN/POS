import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import StatCard from "../../../components/dashboard/StatCard";
import SalesChart from "../../../components/dashboard/SalesChart";
import TopProducts from "../../../components/dashboard/TopProducts";
import LowStock from "../../../components/dashboard/LowStock";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [chart, setChart] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setSummary(data.summary);
        setChart(data.salesByDay);
        setTopProducts(data.topProducts);
        // 🔥 low stock ควรมี api แยก
        // setLowStock(data.lowStock);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="ยอดขายวันนี้" value={`฿${summary?.todaySales || 0}`} />
        <StatCard title="จำนวนบิลวันนี้" value={summary?.todayOrders || 0} />
        <StatCard title="ยอดขายทั้งหมด" value={`฿${summary?.totalSales || 0}`} />
      </div>

      {/* Chart */}
      <SalesChart data={chart} />

      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopProducts data={topProducts} />
        <LowStock data={lowStock} />
      </div>
    </div>
  );
}