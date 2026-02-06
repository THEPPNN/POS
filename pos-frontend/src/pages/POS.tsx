import { usePOS } from "../hooks/usePOS";
import BarcodeInput from "../components/pos/BarcodeInput";
import CartList from "../components/pos/CartList";
import PaySummary from "../components/pos/PaySummary";

export default function POS() {
  const {
    barcodeRef,
    barcode,
    setBarcode,
    cart,
    total,
    scanBarcode,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = usePOS();

  return (
    <div className="h-screen flex gap-4 p-4">
      <div className="w-1/3 bg-white p-4">
        <BarcodeInput
          value={barcode}
          onChange={setBarcode}
          onEnter={() => scanBarcode(barcode)}
          inputRef={barcodeRef}
        />
      </div>

      <div className="w-1/3 bg-white p-4 flex flex-col">
        <CartList
          cart={cart}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeFromCart}
        />
        <PaySummary total={total} />
      </div>
    </div>
  );
}