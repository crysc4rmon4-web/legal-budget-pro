"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientInput } from "@/lib/validations/budget";
import { createClient } from "@/app/actions/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

export default function AddClientForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientInput) => {
    setLoading(true);
    const result = await createClient(data);
    setLoading(false);

    if (result.success) {
      reset();
      setOpen(false);
    } else {
      alert(result.error); // Luego lo cambiaremos por un Toast elegante
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-zinc-800 text-white">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre o Razón Social</Label>
            <Input id="name" {...register("name")} placeholder="Ej. Juan Pérez SL" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nif">NIF / NIE / CIF</Label>
            <Input id="nif" {...register("nif")} placeholder="B12345678" />
            {errors.nif && <p className="text-xs text-red-500">{errors.nif.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="cliente@empresa.com" />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección Fiscal</Label>
            <Input id="address" {...register("address")} placeholder="Calle Mayor 1, Madrid" />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-black" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar Cliente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}