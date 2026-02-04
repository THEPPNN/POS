import CartItemRow from "./CartItemRow";

export default function CartTable({ cart, onQtyChange, onRemove }: any) {
  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">สินค้า</th>
          <th className="p-2">ราคา</th>
          <th className="p-2">จำนวน</th>
          <th className="p-2">รวม</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item: any) => (
          <CartItemRow
            key={item.id}
            item={item}
            onQtyChange={onQtyChange}
            onRemove={onRemove}
          />
        ))}
      </tbody>
    </table>
  );
}