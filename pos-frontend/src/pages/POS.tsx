import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "../lib/axios";
import ServerDataTable from "../components/table/ServerDataTable";
import BarcodeInput from "../components/pos/BarcodeInput";
import ProductList from "../components/pos/ProductList";
import { usePOS } from "./admin/Outlet/UsePos";
import { handleOrder } from "./admin/Outlet/handleOrder";
import { ModalPay } from "./admin/Outlet/ModalPay";

type Product = {
  id: number;
  name: string;
  barcode: string;
  price: number;
};

// type CartItem = Product & {
//   qty: number;
// };

export default function POS() {
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [reload, setReload] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const [reloadHistory, setReloadHistory] = useState(0);
  const [searchInputHistory, setSearchInputHistory] = useState("");

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
    const code = e.target.value;
    setBarcode(code);

    if (!code) return;

    const product: Product | null = await fetchProductByBarcode(code);

    if (!product) {
      Swal.fire("ไม่พบสินค้า", `Barcode: ${code}`, "error");
      setBarcode("");
      return;
    }

    addToCart(product);
    setBarcode("");
  };

  const columns = [
    { name: "", selector: (r: any) => <img src={`${import.meta.env.VITE_API_URL}${r.image}`} alt={r.name} className="w-10 h-10 rounded-full" />, width: "10%" },
    { name: "ชื่อสินค้า", selector: (r: any) => r.name, width: "40%" },
    { name: "ราคา", selector: (r: any) => r.price, width: "15%" },
    { name: "คงเหลือ", selector: (r: any) => r.stock, width: "15%" },
    {
      name: "จัดการ", width: "20%", cell: (row: any) => (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => addToCart(row)}>เพิ่ม</button>
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

  const fetchHistory = async ({ page, perPage, search }: any) => {
    const res = await api.get("/orders", {
      params: {
        offset: (page - 1) * perPage,
        limit: perPage,
        search,
      },
    });
    return {
      data: res.data.orders,
      total: res.data.total,
    };
  };

  const columnsHistory = [
    { name: "วันที่", selector: (r: any) => new Date(r.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }), width: "40%" },
    { name: "ยอดรวม", selector: (r: any) => r.total.toFixed(2), width: "30%" },
    {
      name: "จัดการ", width: "30%", cell: (row: any) => (
        <div className="flex gap-2 justify-end w-full">
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleCancelOrder(row.id)}>ยกเลิก</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleViewOrder(row.id)}>ดู</button>
        </div>
      )
    },
  ];
 
  const {
    handleCancelOrder,
    handleViewOrder,
    open,
    setOpen,
    order,
    loading,
    } = handleOrder(setReloadHistory,setReload);

  
  const {
    cart,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    total,
    setCart,
  } = usePOS();
    

  const [openPay, setOpenPay] = useState(false);

  const modalPay = () => {
    setOpenPay(true);
  };
  
  const handlePay = async (data: any) => {
    try {
      const res = await api.post("/orders", {
        total: total,
        method: data.method,
        received: data.received,
        change: data.change,
        items: cart.map((i) => ({
          productId: i.id,
          qty: i.qty,
          price: i.price,
        })),
      });
      if (res.status === 201) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.data.message,
          icon: "success",
        });
        setCart([]);
        setReload(prev => prev + 1); // 👈 บังคับ reload ตาราง
        setReloadHistory(prev => prev + 1);
      }
      else {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.data.message,
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "แจ้งเตือน",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-4 flex gap-4">
      {openPay && (
        <ModalPay
          total={total}
          setOpen={setOpenPay}
          onConfirm={(data) => {
            handlePay(data);
          }}
        />
      )}
      {/* LEFT */}
      <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col gap-3">

        {/* BARCODE */}
        <BarcodeInput
          barcodeRef={barcodeRef as React.RefObject<HTMLInputElement>}
          barcode={barcode}
          setBarcode={setBarcode}
          handleScan={handleScan}
        />

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
            title="รายการสินค้า"
          />
        </div>
      </div>

      {/* CENTER */}
      <div className="w-1/3 bg-white rounded shadow p-4 flex flex-col">
        <ProductList
          products={cart}
          onIncrease={(id) => increaseQty(id)}
          onDecrease={(id) => decreaseQty(id)}
          onRemove={(id) => removeFromCart(id)}
        />
        {/* TOTAL */}
        <div className="mt-5">
          <p className="text-lg">
            รวมทั้งหมด:{" "}
            <span className="text-3xl font-bold text-green-600">
              {total.toFixed(2)}
            </span>{" "}
            บาท
          </p>

          <button
            onClick={() => modalPay()}
            className="bg-green-600 text-white text-xl py-4 rounded w-full mt-4"
          >
            ชำระเงิน
          </button>
        </div >
      </div>

      {/* RIGHT */}

      <div className="w-1/3 bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold mb-2">ประวัติการขาย</h2>
        <ServerDataTable
          columns={columnsHistory}
          fetchData={fetchHistory}
          reload={reloadHistory}
          searchInput={searchInputHistory}
          title=""
        />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg animate-scale">

            {/* Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-bold">รายละเอียดการขาย</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500">กำลังโหลด...</p>
              ) : (
                <>
                  <div className="text-sm text-gray-500">
                    Order ID: <span className="font-medium">{order?.id}</span>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {order?.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between px-4 py-3"
                      >
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.sellPrice} บาท × {item.qty}
                          </p>
                        </div>

                        <div className="font-bold">
                          {item.sellPrice * item.qty} บาท
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold">รวมทั้งหมด</span>
                    <span className="text-2xl font-bold text-green-600">
                      {order?.total} บาท
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
}