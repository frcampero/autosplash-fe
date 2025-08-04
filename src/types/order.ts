export interface Order {
  _id: string;
  orderId: string;
  customerId?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  status: string;
  total: number;
  paid: number;
  deliveryType?: "estándar" | "urgente";
  careLevel?: "normal" | "delicado";
}
