import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";

interface Props {
  orderId: string;
  className?: string;
}

const ReceiptDownloadButton = ({ orderId, className }: Props) => {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/pdf/order/${orderId}`, {
        responseType: "blob",
      });

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
    <Button variant="outline" onClick={handleDownload} className={className}>
      Descargar PDF
    </Button>
  );
};

export default ReceiptDownloadButton;