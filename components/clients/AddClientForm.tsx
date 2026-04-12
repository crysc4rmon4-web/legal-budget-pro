"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { createClient } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

export function AddClientForm() {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: "", nif: "", email: "", address: "", phone: "" },
  });

  async function onSubmit(values: ClientFormValues) {
    const toastId = toast.loading("Registrando cliente...");
    const result = await createClient(values);
    
    if (result.success) {
      toast.success("Cliente guardado", { id: toastId });
      form.reset();
    } else {
      toast.error(result.error, { id: toastId });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {(["name", "nif", "email", "address", "phone"] as const).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-zinc-500">
                  {fieldName === "name" ? "Razón Social" : fieldName}
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder={`...`} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="w-full h-12 bg-zinc-900" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando..." : "Confirmar Alta"}
        </Button>
      </form>
    </Form>
  );
}