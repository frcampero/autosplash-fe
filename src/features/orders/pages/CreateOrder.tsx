import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import OrderDetailsForm from "@/features/orders/components/OrderDetailsForm";
import {
  ClienteForm,
  PrendasForm,
  PaymentForm,
} from "@/features/orders/components";

const API = import.meta.env.VITE_API_URL;

interface PriceItem {
  _id: string;
  name: string;
  type: "por_prenda" | "fijo";
  price: number;
  points?: number;
}

interface SelectedItem {
  item: PriceItem;
  quantity: number;
}

const CreateOrder = () => {
  const [clientes, setClientes] = useState([]);
  const [priceItems, setPriceItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [form, setForm] = useState({
    clienteExistente: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    estado: "Recibido",
    deliveryType: "estándar",
    careLevel: "normal",
    descripcion: "",
    pagado: "",
    method: "Efectivo",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/customers`, getAuthHeaders()).then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setClientes(data || []);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/prices`, getAuthHeaders())
      .then((res) => {
        setPriceItems(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar precios: ", err);
        toast.error("No se pudieron cargar las prendas.");
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedItems.length === 0) {
        throw new Error("Debe seleccionar al menos una prenda.");
      }

      const pagado = parseFloat(form.pagado || "0");
      if (isNaN(pagado) || pagado < 0) throw new Error("Monto pagado inválido");

      const totalCalculado = selectedItems.reduce((acc, { item, quantity }) => {
        if (
          !item ||
          typeof item.price !== "number" ||
          typeof quantity !== "number"
        )
          return acc;

        if (item.type === "por_prenda") {
          const puntos = item.points ?? 1;
          return acc + puntos * item.price * quantity;
        } else {
          return acc + item.price * quantity;
        }
      }, 0);

      let customerId = form.clienteExistente;
      if (!customerId) {
        const res = await axios.post(
          `${API}/api/customers`,
          {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            email: form.email,
            address: form.address,
          },
          getAuthHeaders()
        );
        customerId = res.data._id;
      }

      const payload = {
        customerId,
        status: form.estado.trim(),
        deliveryType: form.deliveryType,
        careLevel: form.careLevel,
        description: form.descripcion,
        total: totalCalculado,
        paid: pagado,
        method: form.method || "Efectivo",
        items: selectedItems.map(({ item, quantity }) => ({
          itemId: item._id,
          quantity,
        })),
      };

      console.log("Enviando al backend:", {
        ...payload,
        items: selectedItems.map(({ item, quantity }) => ({
          itemId: item._id,
          quantity,
        })),
      });

      const orderRes = await axios.post(
        `${API}/api/orders`,
        payload,
        getAuthHeaders()
      );

      toast.success("Orden creada correctamente", {
        description: "Ya está visible en el panel de ordenes.",
      });

      try {
        const pdfResponse = await axios.get(
          `${API}/api/pdf/order/${orderRes.data._id}`,
          {
            ...getAuthHeaders(),
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `comprobante_${orderRes.data._id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (pdfError) {
        toast.warning(
          "La orden fue creada, pero no se pudo descargar el comprobante."
        );
      }

      navigate("/orders");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Error desconocido";
        toast.error("❌ Error al crear la orden", { description: msg });
      } else {
        toast.error("❌ Error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link to="/orders">
        <Button 
        variant="outline" 
        className="mb-4 focus:outline-none">
          ← Volver
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Crear Orden</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <ClienteForm
          form={form}
          clientes={clientes}
          handleChange={handleChange}
          setForm={setForm}
        />
        <OrderDetailsForm form={form} handleChange={handleChange} />
        <PrendasForm
          priceItems={priceItems}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        <PaymentForm
          form={form}
          handleChange={handleChange}
          selectedItems={selectedItems}
          isLoading={isLoading}
        />
      </form>
    </div>
  );
};

export default CreateOrder;
