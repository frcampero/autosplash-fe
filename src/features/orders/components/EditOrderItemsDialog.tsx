import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Order, OrderItem } from "@/types/order";
import axios from "axios";
import { getAuthHeaders } from "@/lib/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const API = import.meta.env.VITE_API_URL;

interface PriceItem {
    _id: string;
    name: string;
    price: number;
    category: string;
}

interface EditOrderItemsDialogProps {
    order: Order | null;
    onOrderUpdate: (updatedOrder: Order) => void;
    children: React.ReactNode;
}

export default function EditOrderItemsDialog({ order, onOrderUpdate, children }: EditOrderItemsDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [availableItems, setAvailableItems] = useState<PriceItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState("");

    useEffect(() => {
        if (order && order.items) {
            const validItems = order.items.filter(i => i && i.item);
            setItems(JSON.parse(JSON.stringify(validItems)));
        } else if (order) {
            setItems([]);
        }
    }, [order]);

    useEffect(() => {
        if (isOpen) {
            axios.get(`${API}/api/prices`, getAuthHeaders())
                .then(res => {
                    setAvailableItems(res.data.results || res.data);
                })
                .catch(err => {
                    console.error("Error fetching items", err);
                    toast.error("Error al cargar las prendas disponibles");
                });
        }
    }, [isOpen]);

    const handleAddItem = (itemToAdd: PriceItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.item._id === itemToAdd._id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.item._id === itemToAdd._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                const newItem: OrderItem = {
                    item: {
                        _id: itemToAdd._id,
                        name: itemToAdd.name,
                        price: itemToAdd.price,
                        // Asegurarse de que todos los campos necesarios para 'item' estén aquí
                    },
                    quantity: 1
                };
                return [...prevItems, newItem];
            }
        });
    };

    const handleAddPrenda = () => {
        if (!selectedItemId) return;
        const itemToAdd = availableItems.find(i => i._id === selectedItemId);
        if (itemToAdd) {
            handleAddItem(itemToAdd);
        }
        setSelectedItemId(""); // Reset select
    };

    const handleRemoveItem = (itemId: string) => {
        setItems(prevItems => prevItems.filter(i => i.item._id !== itemId));
    };

    const handleQuantityChange = (itemId: string, quantity: number) => {
        if (isNaN(quantity)) {
            return;
        }
        if (quantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        setItems(prevItems =>
            prevItems.map(i =>
                i.item._id === itemId ? { ...i, quantity } : i
            )
        );
    };

    const handleSave = async () => {
        if (!order) return;
        setIsLoading(true);
        try {
            const updatedItems = items.map(i => ({
                item: typeof i.item === 'string' ? i.item : i.item._id,
                quantity: i.quantity
            }));
            const res = await axios.put<Order>(`${API}/api/orders/${order._id}`, { items: updatedItems }, getAuthHeaders());
            onOrderUpdate(res.data);
            toast.success("Prendas actualizadas correctamente");
            setIsOpen(false);
        } catch (error) {
            console.error("Error updating order items", error);
            toast.error("Error al actualizar las prendas");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl rounded-md">
                <DialogHeader>
                    <DialogTitle>Editar Prendas</DialogTitle>
                    <DialogDescription>
                        Agrega, elimina o modifica la cantidad de prendas para esta orden.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Items in order */}
                    <div className="space-y-2">
                        <h4 className="font-medium">Prendas en la orden</h4>
                        {items.length > 0 ? (
                            <div className="border rounded-lg p-3 space-y-2 max-h-[25vh] overflow-y-auto">
                                {/* Header */}
                                <div className="hidden sm:grid grid-cols-[1fr_auto_auto] items-center gap-x-4">
                                    <div className="font-semibold text-sm text-slate-600">Prenda</div>
                                    <div className="font-semibold text-sm text-slate-600 justify-self-center">Cantidad</div>
                                    <div className="font-semibold text-sm text-slate-600 justify-self-center">Quitar</div>
                                </div>

                                {items.map(orderItem => (
                                    orderItem && orderItem.item && (
                                        <div key={orderItem.item._id} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] items-center gap-x-2 sm:gap-x-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium sm:hidden">Prenda</span>
                                                <span className="text-sm">{orderItem.item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-x-2 justify-self-end sm:justify-self-center">
                                                <Input
                                                    type="number"
                                                    value={orderItem.quantity}
                                                    onChange={(e) => handleQuantityChange(orderItem.item._id, parseInt(e.target.value, 10))}
                                                    className="w-20 h-8"
                                                    min="1"
                                                />
                                                <Button variant="outline" size="icon" onClick={() => handleRemoveItem(orderItem.item._id)} className="sm:hidden">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                            <div className="hidden sm:flex justify-center">
                                                <Button variant="outline" size="icon" onClick={() => handleRemoveItem(orderItem.item._id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : <p className="text-sm text-slate-500">No hay prendas en la orden.</p>}
                    </div>

                    {/* Available items to add */}
                    <div className="space-y-2">
                        <h4 className="font-medium">Agregar prendas</h4>
                        <div className="flex items-center gap-2">
                            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prenda..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableItems.map((item) => (
                                        <SelectItem key={item._id} value={item._id}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="button" onClick={handleAddPrenda} className="ml-auto">
                                Agregar
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
