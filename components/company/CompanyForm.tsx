"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanySchema } from "@/lib/validations/company";
import { upsertCompany } from "@/app/actions/company";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CompanyForm({ initialData }: { initialData?: Partial<CompanySchema> }) {
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const toastId = toast.loading("Guardando configuración fiscal...");
    try {
      const result = await upsertCompany(data);
      if (result.success) {
        toast.success("Configuración guardada", { id: toastId });
        window.location.href = "/"; 
      } else {
        toast.error(result.error || "Error al guardar", { id: toastId });
      }
    } catch (error) {
      toast.error("Error crítico de conexión", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Reformas Carmona S.L." {...field} />
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
                <FormLabel>NIF / CIF</FormLabel>
                <FormControl>
                  <Input placeholder="B12345678" {...field} />
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
              <FormLabel>Dirección Fiscal Completa</FormLabel>
              <FormControl>
                <Input placeholder="Calle Ejemplo 123, 28001 Madrid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de Facturación</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@empresa.com" {...field} />
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
              <FormLabel>Sector de Actividad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un sector" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CONSTRUCTION">Construcción y Reformas</SelectItem>
                  <SelectItem value="CONSULTING">Consultoría / Freelance</SelectItem>
                  <SelectItem value="RETAIL">Comercio / Tienda</SelectItem>
                  <SelectItem value="HEALTH">Salud y Bienestar</SelectItem>
                  <SelectItem value="OTHER">Otros sectores</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="defaultVAT"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>IVA por defecto (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="defaultIRPF"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>IRPF por defecto (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl text-lg font-bold transition-all"
        >
          {loading ? "Procesando..." : "Finalizar Configuración"}
        </Button>
      </form>
    </Form>
  );
}