// products.tsx
import { useState } from "react";
import ServerDataTable from "../../../components/table/ServerDataTable";
import api from "../../../lib/axios";
import ModalProduct from "./ModalProduct";
import Swal from "sweetalert2";

export default function ProductsPage() {
  const columns = [
    { name: "รูปภาพ", selector: (r: any) => <img src={`${import.meta.env.VITE_API_URL}${r.image}`} alt={r.name} className="w-10 h-10 rounded-full" />, width: "10%" },
    { name: "ชื่อสินค้า", selector: (r: any) => r.name, width: "30%" },
    { name: "บาร์โค้ด", selector: (r: any) => r.barcode, width: "20%" },
    { name: "ราคา", selector: (r: any) => r.price, width: "10%" },
    { name: "คงเหลือ", selector: (r: any) => r.stock, width: "10%" },
    {
      name: "จัดการ",
      width: "20%",
      cell: (row: any) => (
        <section className="flex gap-2 justify-end w-full">
          <button
            className="w-full bg-yellow-500 text-white py-2 rounded"
            onClick={() => {
              setProduct(row);
              setIsOpen(true);
            }}
          >
            แก้ไข
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 rounded"
            onClick={() => {
              handleDeleteProduct(row.id);
            }}
          >
            ลบ
          </button>
        </section>
      ),
    },
  ];

  const handleDeleteProduct = async (id: number) => {
    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบสินค้านี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await api.delete(`/products/${id}`);
        if (res.status === 200) {
          Swal.fire({
            title: "แจ้งเตือน",
            text: res.data.message,
            icon: "success",
          });
          handleReload();
        } else {
          Swal.fire({
            title: "แจ้งเตือน",
            text: res.data.message,
            icon: "error",
          });
        }
      }
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [reload, setReload] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const handleOpenModal = () => {
    setIsOpen(true);
    setProduct(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setProduct(null);
  };

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

  const handleSubmitProduct = async (formData: FormData) => {
    if (product) {
      let res = await api.put(`/products/${product.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.data.message,
          icon: "success",
        });
        handleReload();
      } else {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.data.message,
          icon: "error",
        });
      }
    } else {
      let res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.data.message,
          icon: "success",
        });
        handleReload();
      } else {
        Swal.fire({
          title: "แจ้งเตือน",
          text: res.data.message,
          icon: "error",
        });
      }
    }

  };

  const handleReload = () => {
    setIsOpen(false);
    setProduct(null);
    setReload((prev) => prev + 1);
  };
  return (

    <div>
      <div className="flex justify-between bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleOpenModal}>
          เพิ่มสินค้า
        </button>
      </div>


      {/* table responsive */}
      <div className="overflow-x-auto bg-white p-4 shadow-md">
      
        <div className="m-2">
          <label className="text-sm font-medium text-gray-600">
            ค้นหาสินค้า
          </label>
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setReload(prev => prev + 1); // 👈 บังคับ reload ตาราง
            }}
            placeholder="ชื่อสินค้า / บาร์โค้ด"
            className="mt-1 text-sm border rounded w-full px-3 py-2"
          />
        </div>

        <ServerDataTable
          columns={columns}
          fetchData={fetchProducts}
          reload={reload}
          searchInput={searchInput}
        />
      </div>


      <ModalProduct
        isOpen={isOpen}
        onClose={handleCloseModal}
        product={product}
        onSubmit={handleSubmitProduct}
      />

    </div>
  );
}