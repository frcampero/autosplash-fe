import axios from "axios";
import { getAuthHeaders } from "@/lib/api";

export const downloadReceipt = async (orderId: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/pdf/order/${orderId}`,
    {
      ...getAuthHeaders(),
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `comprobante_${orderId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};