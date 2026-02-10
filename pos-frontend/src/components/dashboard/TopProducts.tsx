// components/dashboard/TopProducts.tsx
export default function TopProducts({ data }: any) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-bold mb-2 text-green-700">สินค้าขายดี</h3>
        <table className="w-full">
          <tbody>
            {data.map((p: any) => (
              <tr key={p.id} className="border-b py-2">
                <td>{p.name}</td>
                <td className="text-right">{p.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }