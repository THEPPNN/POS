import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type Product = {
  id: number;
  name: string;
  barcode: string;
  price: number;
};

type CartItem = Product & {
  qty: number;
};

export default function POS() {
  const API_URL = import.meta.env.VITE_API_URL;

  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // auto focus ตลอดเวลา (ยิงรัว ๆ)
  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const fetchProductByBarcode = async (code: string) => {
    try {
      const res = await axios.get(`${API_URL}/products/barcode/${code}`);
      return res.data;
    } catch {
      return null;
    }
  };

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    if (!barcode) return;

    const product: Product | null = await fetchProductByBarcode(barcode);

    if (!product) {
      Swal.fire("ไม่พบสินค้า", `Barcode: ${barcode}`, "error");
      setBarcode("");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });

    setBarcode("");
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="h-screen bg-gray-100 p-4 flex gap-4">
      {/* LEFT */}
      <div className="w-2/3 bg-white rounded shadow p-4">
        <input
          ref={barcodeRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleScan}
          placeholder="ยิงบาร์โค้ด..."
          className="w-full border p-3 text-xl mb-4"
        />

        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">สินค้า</th>
              <th className="p-2">ราคา</th>
              <th className="p-2">จำนวน</th>
              <th className="p-2">รวม</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.price}</td>
                <td className="p-2 text-center">{item.qty}</td>
                <td className="p-2 text-center">
                  {item.price * item.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT */}
      <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">สรุป</h2>
          <p className="text-lg">
            รวมทั้งหมด:{" "}
            <span className="text-3xl font-bold text-green-600">
              {total.toFixed(2)}
            </span>{" "}
            บาท
          </p>
        </div>

        <button
          onClick={() =>
            Swal.fire("ชำระเงินสำเร็จ", `ยอด ${total} บาท`, "success")
          }
          className="bg-green-600 text-white text-xl py-4 rounded"
        >
          ชำระเงิน
        </button>
      </div>
    </div>
  );
}