import type { CartItem } from "../../hooks/usePOS";

type Props = {
  cart: CartItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
};

export default function CartList({ cart, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between py-2 border-b">
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="text-sm text-gray-500">
              {item.price} x {item.qty} = {item.price * item.qty}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => onDecrease(item.id)}>-</button>
            <span>{item.qty}</span>
            <button onClick={() => onIncrease(item.id)}>+</button>
            <button onClick={() => onRemove(item.id)}>ลบ</button>
          </div>
        </div>
      ))}
    </div>
  );
}