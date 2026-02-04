import { useState } from "react";

const mockProducts = [
  { id: 1, name: "น้ำเปล่า", barcode: "111", price: 10 },
  { id: 2, name: "ขนม", barcode: "222", price: 20 },
];

export default function BarcodeInput({ onScan }: any) {
  const [barcode, setBarcode] = useState("");

  const handleScan = (code: string) => {
    const product = mockProducts.find((p) => p.barcode === code);
    if (product) onScan(product);
  };

  return (
    <input
      autoFocus
      className="w-full p-3 border rounded mb-3 text-lg"
      placeholder="ยิงบาร์โค้ดสินค้า..."
      value={barcode}
      onChange={(e) => setBarcode(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleScan(barcode);
          setBarcode("");
        }
      }}
    />
  );
}