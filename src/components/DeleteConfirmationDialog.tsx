import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Props {
  onConfirm: () => void;
  children: React.ReactNode;
  itemName?: string;
  itemType?: string;
}

const DeleteConfirmationDialog = ({ onConfirm, children, itemName, itemType = 'elemento' }: Props) => {
  const [open, setOpen] = useState(false);

  const title = `¿Eliminar este ${itemType}?`;
  const description = itemName
    ? `Estás a punto de eliminar "${itemName}". Esta acción no se puede deshacer.`
    : "Esta acción no se puede deshacer.";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <p className="text-sm text-gray-500">{description}</p>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            className="focus:outline-none focus:ring-0"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-0"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
