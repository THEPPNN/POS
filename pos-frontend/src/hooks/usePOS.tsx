import { useEffect, useRef, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  barcode: string;
};

export function usePOS() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const barcodeRef = useRef<HTMLInputElement>(null);

  // mock database
  const PRODUCTS = [
    { id: 1, barcode: "8850425012544", name: "น้ำดื่ม", price: 10 },
    { id: 2, barcode: "1234567890123", name: "ขนม", price: 20 },
  ];

  useEffect(() => {
    barcodeRef.current?.focus();
  }, []);

  const scanBarcode = (value: string) => {
    if (!value) return;

    const product = PRODUCTS.find(p => p.barcode === value);
    if (!product) {
      alert("ไม่พบสินค้า");
      setBarcode("");
      return;
    }

    setCart(prev => {
      const exist = prev.find(item => item.barcode === value);
      if (exist) {
        return prev.map(item =>
          item.barcode === value
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          barcode: product.barcode,
        },
      ];
    });

    setBarcode("");
    barcodeRef.current?.focus();
  };

  const increaseQty = (barcode: string) => {
    setCart(prev =>
      prev.map(item =>
        item.barcode === barcode
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  const decreaseQty = (barcode: string) => {
    setCart(prev =>
      prev
        .map(item =>
          item.barcode === barcode
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeFromCart = (barcode: string) => {
    setCart(prev => prev.filter(item => item.barcode !== barcode));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return {
    barcode,
    setBarcode,
    barcodeRef,
    cart,
    total,
    scanBarcode,
    increaseQty,
    decreaseQty,
    removeFromCart,
  };
}