export interface OrderItem {
  item: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: number;
  customerId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  status: string;
  total: number;
  paid: number;
  deliveryType?: "estándar" | "urgente";
  careLevel?: "normal" | "delicado";
  items: OrderItem[];
  description?: string;
}

