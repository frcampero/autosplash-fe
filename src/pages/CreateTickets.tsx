import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "../lib/auth";
import { Button } from "../components/ui/button";
import ClienteForm from "../components/tickets/ClienteForm";
import OrderDetailsForm from "../components/tickets/OrderDetailsForm";
import PrendasForm from "../components/tickets/PrendasForm";
import PaymentForm from "../components/tickets/PaymentForm";

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

const CreateTicket = () => {
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
    prioridad: "Standard",
    descripcion: "",
    nota: "",
    pagado: "",
    method: "Efectivo",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/customers`, getAuthHeaders())
      .then((res) => setClientes(res.data));
    axios.get(`${API}/api/prices`).then((res) => setPriceItems(res.data));
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
      const pagado = parseFloat(form.pagado || "0");
      if (isNaN(pagado) || pagado < 0) throw new Error("Monto pagado inválido");
      const totalCalculado = selectedItems.reduce((acc, { item, quantity }) => {
        return (
          acc +
          (item.type === "por_prenda"
            ? (item.points ?? 1) * item.price * quantity
            : item.price * quantity)
        );
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
      const orderRes = await axios.post(
        `${API}/api/orders`,
        {
          customerId,
          status: form.estado.trim(),
          priority: form.prioridad,
          note: form.nota,
          description: form.descripcion,
          total: totalCalculado,
          paid: pagado,
          items: selectedItems.map(({ item, quantity }) => ({
            name: item.name,
            type: item.type,
            price: item.price,
            points: item.points,
            quantity,
          })),
        },
        getAuthHeaders()
      );
      if (pagado > 0) {
        await axios.post(
          `${API}/api/payments`,
          {
            orderId: orderRes.data._id,
            amount: pagado,
            method: form.method,
          },
          getAuthHeaders()
        );
      }
      toast.success("Ticket creado correctamente", {
        description: "Ya está visible en el panel de tickets.",
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
          "El ticket fue creado, pero no se pudo descargar el comprobante."
        );
      }
      navigate("/tickets");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Error desconocido";
        toast.error("❌ Error al crear el ticket", { description: msg });
      } else {
        toast.error("❌ Error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link to="/tickets">
        <Button variant="outline" className="mb-4 focus:outline-none">
          ← Volver a Tickets
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Crear nuevo ticket</h1>
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

export default CreateTicket;
