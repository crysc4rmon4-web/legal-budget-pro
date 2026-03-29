"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { createClient } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ControllerRenderProps } from "react-hook-form";

export function AddClientForm() {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      nif: "",
      email: "",
      address: "",
      phone: "",
    },
  });

  async function onSubmit(values: ClientFormValues) {
    const toastId = toast.loading("Guardando cliente...");
    try {
      const result = await createClient(values);
      if (result.success) {
        toast.success("Cliente registrado con éxito", { id: toastId });
        form.reset();
      } else {
        toast.error(result.error || "Error al guardar", { id: toastId });
      }
    } catch (error) {
      toast.error("Error crítico de conexión", { id: toastId });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {(["name", "nif", "email", "address"] as const).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }: { field: ControllerRenderProps<ClientFormValues, typeof fieldName> }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 font-semibold capitalize">
                  {fieldName === "name" ? "Nombre o Razón Social" : fieldName.toUpperCase()}
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder={`Introduce ${fieldName}...`} 
                    className="bg-zinc-50 border-zinc-200 focus:ring-zinc-900"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-6 rounded-xl transition-all shadow-lg"
        >
          {form.formState.isSubmitting ? "Procesando..." : "Confirmar Alta"}
        </Button>
      </form>
    </Form>
  );
}