// handleOrder.tsx
import { useState } from "react";
import api from "../../../lib/axios";
import Swal from "sweetalert2";

export const handleOrder = (setReloadHistory: React.Dispatch<React.SetStateAction<number>>) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const handleViewOrder = async (id: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id: number) => {
    Swal.fire({
      title: "แจ้งเตือน",
      text: "ยกเลิกบิล หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยกเลิกบิล",
      cancelButtonText: "ปิด",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(`/orders/${id}`);
          if (res.status === 200) {
            Swal.fire({
              title: "แจ้งเตือน",
              text: res.data.message,
              icon: "success",
            });
            setReloadHistory(prev => prev + 1);
          }
          if (res.status === 500) {
            Swal.fire({
              title: "แจ้งเตือน",
              text: res.data.message,
              icon: "error",
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return {
    handleViewOrder,
    handleCancelOrder,
    open,
    setOpen,
    order,
    loading,
  };
};