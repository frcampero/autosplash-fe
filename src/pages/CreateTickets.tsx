import { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { getAuthHeaders } from "../lib/auth";

const API = import.meta.env.VITE_API_URL;

const CreateTicket = () => {
  const [clientes, setClientes] = useState([]);
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
    total: "",
    pagado: "",
    method: "Efectivo",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/customers`, getAuthHeaders())
      .then((res) => setClientes(res.data))
      .catch((err) => console.error("Error al traer clientes", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const total = parseFloat(form.total);
      const pagado = parseFloat(form.pagado || "0");
      if (isNaN(total) || total < 0) throw new Error("Total inválido");
      if (isNaN(pagado) || pagado < 0) throw new Error("Monto pagado inválido");

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

      const estadoLimpio = form.estado.trim();

      const orderRes = await axios.post(
        `${API}/api/orders`,
        {
          customerId,
          status: estadoLimpio,
          priority: form.prioridad,
          note: form.nota,
          description: form.descripcion,
          total,
          paid: pagado,
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

      // ⬇️ Descargar automáticamente el comprobante PDF
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
        console.error("Error al descargar comprobante:", pdfError);
        toast.warning(
          "El ticket fue creado, pero no se pudo descargar el comprobante."
        );
      }

      navigate("/tickets");
    } catch (err: any) {
      console.error("Error al crear el ticket:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Error desconocido";

      toast.error("❌ Error al crear el ticket", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link to="/tickets">
        <Button variant="outline" className="mb-4">
          ← Volver a Tickets
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">Crear nuevo ticket</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <fieldset className="space-y-3 border rounded p-4">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Datos del cliente
          </legend>

          <div>
            <label className="text-sm font-medium">Cliente existente</label>
            <select
              name="clienteExistente"
              value={form.clienteExistente}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
            >
              <option value="">-- Nuevo cliente --</option>
              {clientes.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName} - {c.phone}
                </option>
              ))}
            </select>
          </div>

          {!form.clienteExistente && (
            <>
              <Input
                name="firstName"
                placeholder="Nombre"
                value={form.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Apellido"
                value={form.lastName}
                onChange={handleChange}
              />
              <Input
                name="phone"
                placeholder="Teléfono"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                name="address"
                placeholder="Dirección"
                value={form.address}
                onChange={handleChange}
              />
            </>
          )}
        </fieldset>

        <fieldset className="space-y-3 border rounded p-4">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Datos de orden
          </legend>

          <div>
            <label className="text-sm font-medium">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
            >
              <option value="Recibido">Recibido</option>
              <option value="En progreso">En progreso</option>
              <option value="Completado">Completado</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Prioridad</label>
            <select
              name="prioridad"
              value={form.prioridad}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
            >
              <option value="Standard">Standard</option>
              <option value="Express">Express</option>
              <option value="Delicado">Delicado</option>
            </select>
          </div>

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          />

          <Input
            name="nota"
            placeholder="Nota interna"
            value={form.nota}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset className="space-y-3 border rounded p-4 flex flex-col justify-between">
          <legend className="text-sm font-semibold text-gray-700 mb-2">
            Datos de pago
          </legend>

          <Input
            type="number"
            name="total"
            placeholder="Total ($)"
            value={form.total}
            onChange={handleChange}
            required
          />

          <Input
            type="number"
            name="pagado"
            placeholder="Pagado ($)"
            value={form.pagado}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm font-medium">Método de pago</label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de Credito">Tarjeta de Crédito</option>
              <option value="Tarjeta de debito">Tarjeta de Débito</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Restante: $
            {Math.max(
              0,
              parseFloat(form.total || "0") - parseFloat(form.pagado || "0")
            ).toFixed(2)}
          </div>

          <Button type="submit" className="mt-6" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear ticket"}
          </Button>
        </fieldset>
      </form>
    </div>
  );
};

export default CreateTicket;
