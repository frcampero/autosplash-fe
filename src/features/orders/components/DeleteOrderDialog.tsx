import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Props {
  onDelete: () => void;
  children: React.ReactNode;
}

const DeleteOrderDialog = ({ onDelete, children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta orden?</AlertDialogTitle>
        </AlertDialogHeader>
        <p className="text-sm text-muted-foreground">
          Esta acción no se puede deshacer.
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel className="focus:outline-none focus:ring-0">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            onClick={() => {
              onDelete();
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

export default DeleteOrderDialog;
