import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "../lib/axios";
import ServerDataTable from "../components/table/ServerDataTable";

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
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [reload, setReload] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  
  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const fetchProductByBarcode = async (code: string) => {
    try {
      const res = await api.get(`/products/barcode/${code}`);
      return res.data.product;
    } catch {
      return null;
    }
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
    if (!barcode) return;

    const product: Product | null = await fetchProductByBarcode(barcode);
    if(product) {
      handleAddToCart(product);
    }
    if (!product) {
      Swal.fire("ไม่พบสินค้า", `Barcode: ${barcode}`, "error");
      setBarcode("");
      return;
    }
    setBarcode("");
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const columns = [
    { name: "", selector: (r: any) => <img src={`${import.meta.env.VITE_API_URL}${r.image}`} alt={r.name} className="w-10 h-10 rounded-full" />, width: "10%" },
    { name: "ชื่อสินค้า", selector: (r: any) => r.name, width: "40%" },
    { name: "ราคา", selector: (r: any) => r.price, width: "15%" },
    { name: "คงเหลือ", selector: (r: any) => r.stock, width: "15%" },
    {
      name: "จัดการ", width: "20%", cell: (row: any) => (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAddToCart(row)}>เพิ่ม</button>
      )
    },
  ];

  const fetchProducts = async ({ page, perPage, search }: any) => {
    const res = await api.get("/products", {
      params: {
        offset: (page - 1) * perPage,
        limit: perPage,
        search,
      },
    });
    return {
      data: res.data.products,
      total: res.data.total,
    };
  };

  const handleAddToCart = (row: any) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === row.id);
      if (exists) {
        return prev.map((i) => i.id === row.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...row, qty: 1 }];
    });
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="h-screen bg-gray-100 p-4 flex gap-4">
      {/* LEFT */}
      <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col gap-3">

        {/* BARCODE */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            ยิงบาร์โค้ด
          </label>
          <input
            ref={barcodeRef}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleScan(e);
              }
            }}
            placeholder="สแกนบาร์โค้ด..."
            className="mt-1 text-lg border rounded w-full px-4 py-3 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* SEARCH */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            ค้นหาสินค้า
          </label>
          <input
             value={searchInput}
             onChange={(e) => {
               setSearchInput(e.target.value);
               setReload(prev => prev + 1); // 👈 บังคับ reload ตาราง
             }}
             placeholder="ชื่อสินค้า.."
            className="mt-1 text-sm border rounded w-full px-3 py-2"
          />
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-hidden">
          <ServerDataTable
            columns={columns}
            fetchData={fetchProducts}
            reload={reload}
            searchInput={searchInput}
          />
        </div>
      </div>

      {/* CENTER */}
      <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">สรุป</h2>
        {/* CART LIST */}
        <div className="flex-1 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div>
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.price} บาท x {item.qty} = {item.price * item.qty} บาท
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQty(item.id)} className="w-10 h-10 bg-gray-200 px-4 py-2 rounded">-</button>
                <span className="text-sm font-bold">{item.qty}</span>
                <button onClick={() => increaseQty(item.id)} className="w-10 h-10 bg-gray-200 px-4 py-2 rounded">+</button>
                <button onClick={() => removeFromCart(item.id)}>ลบ</button>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-4">
          <p className="text-lg">
            รวมทั้งหมด:{" "}
            <span className="text-3xl font-bold text-green-600">
              {total.toFixed(2)}
            </span>{" "}
            บาท
          </p>

          <button
            onClick={() =>
              Swal.fire("ชำระเงินสำเร็จ", `ยอด ${total} บาท`, "success")
            }
            className="bg-green-600 text-white text-xl py-4 rounded w-full mt-4"
          >
            ชำระเงิน
          </button>
        </div>
      </div >

      {/* RIGHT */}

      <div className="w-1/3 bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">ประวัติ</h2>
        <div className="overflow-x-auto">
        </div>
      </div>
    </div >
  );
}