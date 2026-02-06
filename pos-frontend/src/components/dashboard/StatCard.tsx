// components/dashboard/StatCard.tsx
type Props = {
    title: string;
    value: string | number;
    sub?: string;
  };
  
  export default function StatCard({ title, value, sub }: Props) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs text-green-600">{sub}</p>}
      </div>
    );
  }