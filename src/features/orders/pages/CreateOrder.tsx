import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import OrderDetailsForm from "@/features/orders/components/OrderDetailsForm";
import CustomerForm from "@/features/orders/components/CustomerForm";
import PrendasForm from "@/features/orders/components/PrendasForm";
import PaymentForm from "@/features/orders/components/PaymentForm";
import { ArrowLeft, Check, ShoppingCart, User, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const STEPS = [
  {
    id: 1,
    name: "Cliente",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: 2,
    name: "Prendas y Detalles",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: 3,
    name: "Resumen y Pago",
    icon: <Wallet className="h-5 w-5" />,
  },
];

const CreateOrder = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
    axios
      .get(`${API}/api/customers`, {
        ...getAuthHeaders(),
        params: { limit: 9999 },
      })
      .then((res) => {
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!form.clienteExistente && (!form.firstName || !form.lastName)) {
        toast.error("Debe seleccionar un cliente o registrar uno nuevo.");
        return;
      }
    }
    setCurrentStep((prev) => (prev < STEPS.length ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CustomerForm
            clientes={clientes}
            form={form}
            handleChange={handleChange}
            setForm={setForm}
          />
        );
      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PrendasForm
                priceItems={priceItems}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <OrderDetailsForm
                form={form}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <PaymentForm
            form={form}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            selectedItems={selectedItems}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold ml-4">Crear Nueva Orden</h1>
      </div>

      <div className="relative flex justify-between items-center w-full max-w-md mx-auto mb-8">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
        <div
          className="absolute left-0 top-1/2 h-0.5 bg-blue-600 transition-all duration-300 -translate-y-1/2"
          style={{
            width: `calc(${
              ((currentStep - 1) / (STEPS.length - 1)) * 100
            }% )`,
          }}
        ></div>
        {STEPS.map((step) => (
          <div key={step.id} className="relative z-10">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${
                step.id <= currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.icon
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          if (currentStep === STEPS.length) {
            handleSubmit(e);
          } else {
            e.preventDefault();
            nextStep();
          }
        }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          ) : (
            <div />
          )}
          {currentStep < STEPS.length ? (
            <Button type="submit">
              Siguiente
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando Orden..." : "Finalizar y Crear Orden"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;