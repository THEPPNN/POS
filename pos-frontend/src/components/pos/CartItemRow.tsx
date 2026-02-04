export default function CartItemRow({ item, onQtyChange, onRemove }: any) {
    return (
      <tr className="border-t">
        <td className="p-2">{item.name}</td>
        <td className="p-2 text-center">{item.price}</td>
        <td className="p-2 text-center">
          <input
            type="number"
            min={1}
            className="w-16 border text-center"
            value={item.qty}
            onChange={(e) => onQtyChange(item.id, +e.target.value)}
          />
        </td>
        <td className="p-2 text-center">{item.price * item.qty}</td>
        <td className="p-2 text-center">
          <button
            className="text-red-500"
            onClick={() => onRemove(item.id)}
          >
            ✕
          </button>
        </td>
      </tr>
    );
  }