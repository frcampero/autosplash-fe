import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;

const EditCustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${API}/api/customers/${id}`, getAuthHeaders());
        const c = res.data;
        setFirstName(c.firstName);
        setLastName(c.lastName);
        setPhone(c.phone || "");
        setAddress(c.address || "");
      } catch (err) {
        toast.error("Error al cargar cliente");
      }
    };

    fetchCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(
        `${API}/api/customers/${id}`,
        { firstName, lastName, phone, address },
        getAuthHeaders()
      );
      toast.success("Cliente actualizado");
      navigate(`/customers/${id}`);
    } catch (err) {
      console.error("Error al actualizar cliente:", err);
      toast.error("Error al actualizar cliente");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Editar Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
};

export default EditCustomerForm;
