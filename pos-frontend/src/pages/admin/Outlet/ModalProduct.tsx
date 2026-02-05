import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSubmit: (data: any) => void;
};

const initialForm = {
  name: "",
  barcode: "",
  price: "",
  stock: "",
  image: null as File | null,
};

export default function ModalProduct({
  isOpen,
  onClose,
  product,
  onSubmit,
}: Props) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isOpen) {
      // 🔥 modal ปิด → reset
      setForm(initialForm);
      return;
    }

    if (product) {
      // ✏️ แก้ไข
      setForm({
        name: product.name ?? "",
        barcode: product.barcode ?? "",
        price: String(product.price ?? ""),
        stock: String(product.stock ?? ""),
        image: null,
      });
    } else {
      // ➕ เพิ่มใหม่
      setForm(initialForm);
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 p-2"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {product ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">ชื่อสินค้า</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="ชื่อสินค้า"
            />
          </div>
          <div>
            <label htmlFor="barcode">บาร์โค้ด</label>
            <input
              className="input"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="บาร์โค้ด"
            />
          </div>
          <div>
            <label htmlFor="price">ราคาขาย</label>
            <input
              type="number"
              className="input"
              name="price"
              placeholder="ราคาขาย"
              value={form.price}
              onChange={handleChange}
            />

          </div>
          <div>
            <label htmlFor="stock">จำนวนคงเหลือ</label>
            <input
              type="number"
              className="input"
              name="stock"
              placeholder="จำนวนคงเหลือ"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div>
            {product ? <label htmlFor="image">เพิ่มรูปภาพหากต้องการแก้ไข</label> : <label htmlFor="image">รูปภาพ</label>}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
    <br />
          <div className="flex gap-2">
            <button className="flex-1 bg-green-600 py-2 rounded text-white" type="submit">
              {product ? "บันทึก" : "สร้างสินค้า"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}