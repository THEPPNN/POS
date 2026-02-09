import { useState, useMemo } from "react";

type PayMethod = "CASH" | "CREDIT" | "TRANSFER" | "OTHER";

export const ModalPay = ({
  total,
  setOpen,
  onConfirm,
}: {
  total: number;
  setOpen: (open: boolean) => void;
  onConfirm: (data: {
    method: PayMethod;
    received?: number;
    change?: number;
  }) => void;
}) => {
  const [method, setMethod] = useState<PayMethod>("CASH");
  const [received, setReceived] = useState<number>(0);

  const change = useMemo(() => {
    if (method !== "CASH") return 0;
    return Math.max(received - total, 0);
  }, [received, total, method]);

  const canPay = useMemo(() => {
    if (method === "CASH") return received >= total;
    return true;
  }, [method, received, total]);

  const handleConfirm = () => {
    onConfirm({
      method,
      received: method === "CASH" ? received : undefined,
      change: method === "CASH" ? change : undefined,
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative space-y-4">
        <button
          className="absolute top-2 right-2 text-gray-500 p-2"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center">
          ชำระเงิน {total.toLocaleString()} บาท
        </h2>

        {/* วิธีชำระเงิน */}
        <div className="space-y-2">
          <label className="font-medium">ช่องทางการชำระเงิน</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`border p-2 rounded ${
                method === "CASH" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setMethod("CASH")}
            >
              💵 เงินสด
            </button>
            <button
              className={`border p-2 rounded ${
                method === "CREDIT" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setMethod("CREDIT")}
            >
              💳 บัตรเครดิต
            </button>
            <button
              className={`border p-2 rounded ${
                method === "TRANSFER" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setMethod("TRANSFER")}
            >
              📱 โอนเงิน
            </button>
            <button
              className={`border p-2 rounded ${
                method === "OTHER" ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setMethod("OTHER")}
            >
              🧾 อื่น ๆ
            </button>
          </div>
        </div>

        {/* เงินสด */}
        {method === "CASH" && (
          <div className="space-y-2">
            <label className="font-medium">รับเงิน</label>
            <input
              type="number"
              className="border rounded w-full p-2"
              value={received}
              onChange={(e) => setReceived(Number(e.target.value))}
              placeholder="จำนวนเงินที่ลูกค้าจ่าย"
            />

            <div className="flex justify-between text-sm">
              <span>เงินทอน</span>
              <span className="font-bold text-green-600">
                {change.toLocaleString()} บาท
              </span>
            </div>
          </div>
        )}

        {/* ปุ่ม */}
        <button
          disabled={!canPay}
          onClick={handleConfirm}
          className={`w-full p-3 rounded text-white font-bold ${
            canPay ? "bg-green-500 hover:bg-green-600" : "bg-gray-300"
          }`}
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
};