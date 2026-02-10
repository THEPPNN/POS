// components/dashboard/StatCard.tsx
type Props = {
    title: string;
    value: string | number;
    sub?: string;
  };
  
  export default function StatCard({ title, value, sub }: Props) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <p className="text-gray-500 mb-2">{title}</p>
        <p className="text-5xl font-bold mb-2">{value}</p>
        {sub && <p className="text-xs text-green-600">{sub}</p>}
      </div>
    );
  }