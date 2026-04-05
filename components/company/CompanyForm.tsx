// components/company/CompanyForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanySchema } from "@/lib/validations/company";
import { upsertCompany } from "@/app/actions/company";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function CompanyForm({ initialData }: { initialData?: Partial<CompanySchema> }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: initialData?.name || "",
      nif: initialData?.nif || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
      sector: initialData?.sector || "OTHER",
      defaultVAT: initialData?.defaultVAT ?? 21,
      defaultIRPF: initialData?.defaultIRPF ?? 0,
    }
  });

  const onSubmit = async (data: CompanySchema) => {
    const toastId = toast.loading("Sincronizando datos fiscales...");
    
    startTransition(async () => {
      try {
        const result = await upsertCompany(data);
        if (result.success) {
          toast.success("Perfil fiscal activado", { id: toastId });
          router.refresh(); // Limpia la caché del servidor
          router.push("/"); // Nos movemos al Dashboard
        } else {
          toast.error(typeof result.error === 'string' ? result.error : "Error en el formulario", { id: toastId });
        }
      } catch (error) {
        toast.error("Error crítico de comunicación", { id: toastId });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Razón Social</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Reformas Carmona S.L." className="rounded-xl border-slate-200 focus:ring-black" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nif"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">NIF / CIF</FormLabel>
                <FormControl>
                  <Input placeholder="B12345678" className="rounded-xl border-slate-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-slate-700">Dirección Fiscal</FormLabel>
              <FormControl>
                <Input placeholder="Calle Ejemplo 123, Madrid" className="rounded-xl border-slate-200" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Email Facturación</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@empresa.com" className="rounded-xl border-slate-200" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-slate-700">Sector</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="CONSTRUCTION">Construcción</SelectItem>
                    <SelectItem value="CONSULTING">Consultoría</SelectItem>
                    <SelectItem value="RETAIL">Comercio</SelectItem>
                    <SelectItem value="OTHER">Otros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <FormField
            control={form.control}
            name="defaultVAT"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs font-bold text-slate-500 uppercase">IVA Defecto (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" className="bg-white border-slate-200" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defaultIRPF"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-xs font-bold text-slate-500 uppercase">IRPF Defecto (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" className="bg-white border-slate-200" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-black hover:bg-zinc-800 text-white py-7 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-black/10"
        >
          {isPending ? "Sincronizando..." : "Finalizar Configuración"}
        </Button>
      </form>
    </Form>
  );
}