// components/dashboard/LowStock.tsx
export default function LowStock({ data }: any) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-bold mb-2 text-red-600">สินค้าใกล้หมด</h3>
        <ul className="">
          {data.map((p: any) => (
            <li key={p.id} className="flex justify-between border-b py-1">
              <span>{p.name}</span>
              <span className="text-red-600">{p.stock}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }