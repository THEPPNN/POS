import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "../lib/axios";

export type Product = {
  id: number;
  name: string;
  barcode: string;
  price: number;
};

export type CartItem = Product & { qty: number };

export function usePOS() {
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const scanBarcode = async (code: string) => {
    if (!code) return;

    const product = await fetchProductByBarcode(code);

    if (!product) {
      Swal.fire("ไม่พบสินค้า", `Barcode: ${code}`, "error");
      return;
    }

    addToCart(product);
  };

  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return {
    barcodeRef,
    barcode,
    setBarcode,
    cart,
    total,
    scanBarcode,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  };
}