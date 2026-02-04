import { useState } from "react";

export default function SummaryPanel({ cart }: any) {
  const [cash, setCash] = useState(0);

  const total = cart.reduce(
    (sum: number, i: any) => sum + i.price * i.qty,
    0
  );

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="text-xl font-bold">สรุปการขาย</h2>

      <div className="flex justify-between">
        <span>รวม</span>
        <span>{total} บาท</span>
      </div>

      <input
        type="number"
        placeholder="รับเงิน"
        className="w-full border p-2"
        onChange={(e) => setCash(+e.target.value)}
      />

      <div className="flex justify-between">
        <span>เงินทอน</span>
        <span>{cash - total}</span>
      </div>

      <button className="w-full bg-green-600 text-white py-2 rounded">
        ชำระเงิน
      </button>
    </div>
  );
}