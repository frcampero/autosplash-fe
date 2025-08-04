import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";

interface Props {
  orderId: string;
}

const ReceiptDownloadButton = ({ orderId }: Props) => {
  const handleDownload = async () => {
    try {
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
    } catch (err) {
      console.error("❌ Error al descargar comprobante:", err);
      toast.error("No se pudo generar el comprobante PDF");
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} className="mt-4">
      Descargar comprobante
    </Button>
  );
};

export default ReceiptDownloadButton;