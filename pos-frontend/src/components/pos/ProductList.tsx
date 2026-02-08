type Props = {
  products: Product[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
};

export default function ProductList({
  products,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">ตะกร้าสินค้า</h2>
      {/* CART LIST */}
      <div className="flex-1 overflow-y-auto">
        {products.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b">
            <div>
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.price} บาท x {item.qty} = {item.price * item.qty} บาท
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => onDecrease(item.id)} className="w-10 h-10 bg-gray-200 px-4 py-2 rounded">-</button>
              <span className="text-sm font-bold">{item.qty}</span>
              <button onClick={() => onIncrease(item.id)} className="w-10 h-10 bg-gray-200 px-4 py-2 rounded">+</button>
              <button onClick={() => onRemove(item.id)}>ลบ</button>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}