"use client";

import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanySchema } from "@/lib/validations/company";
import { upsertCompany } from "@/app/actions/company";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
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
      sector: initialData?.sector || "PROFESSIONAL",
      regime: initialData?.regime || "GENERAL",
      defaultVAT: initialData?.defaultVAT ?? 21,
      defaultIRPF: initialData?.defaultIRPF ?? 15,
      taxNotes: initialData?.taxNotes || "",
    }
  });

  // 🧠 CEREBRO FISCAL: Observamos los cambios en tiempo real
  const selectedSector = useWatch({ control: form.control, name: "sector" });
  const currentVAT = useWatch({ control: form.control, name: "defaultVAT" });

  useEffect(() => {
    // Autocompletado inteligente basado en la normativa
    if (selectedSector === "HEALTH" || selectedSector === "EDUCATION") {
      form.setValue("defaultVAT", 0);
      form.setValue("defaultIRPF", 0);
      form.setValue("regime", "EXEMPT");
    } else if (selectedSector === "PROFESSIONAL") {
      form.setValue("defaultVAT", 21);
      form.setValue("defaultIRPF", 15);
      form.setValue("regime", "GENERAL");
    } else if (selectedSector === "RETAIL_RE") {
      form.setValue("defaultVAT", 21);
      form.setValue("defaultIRPF", 0);
      form.setValue("regime", "EQUIVALENCE_SURCHARGE");
    } else if (selectedSector === "AGRICULTURE") {
      form.setValue("defaultVAT", 10);
      form.setValue("defaultIRPF", 2);
      form.setValue("regime", "GENERAL");
    } else if (selectedSector === "CONSTRUCTION") {
      form.setValue("defaultVAT", 21); // Se deja 21 por defecto, pero suele llevar Inversión del Sujeto Pasivo
      form.setValue("defaultIRPF", 1); // 1% para módulos/ciertas retenciones, o 0% si es SL
      form.setValue("regime", "GENERAL");
    }
  }, [selectedSector, form]);

  // Alarma sutil si se altera la normativa habitual
  const isTaxAlert = 
    ((selectedSector === "HEALTH" || selectedSector === "EDUCATION") && currentVAT > 0) || 
    (selectedSector === "PROFESSIONAL" && currentVAT < 21);

  const onSubmit = async (data: CompanySchema) => {
    const toastId = toast.loading("Validando perfil y sincronizando normativas...");
    
    startTransition(async () => {
      try {
        const result = await upsertCompany(data);
        if (result.success) {
          toast.success("Perfil fiscal blindado y activado", { id: toastId });
          router.refresh(); 
          router.push("/"); 
        } else {
          toast.error(typeof result.error === 'string' ? result.error : "Error en el formulario", { id: toastId });
        }
      } catch (error) {
        toast.error("Error crítico de comunicación con el registro", { id: toastId });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-8 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        
        {/* Cabecera del formulario indicando entorno seguro */}
        <div className="pb-4 border-b border-slate-100 mb-6">
          <h2 className="text-xl font-bold text-slate-900">Perfil Fiscal Antifraude</h2>
          <p className="text-sm text-slate-500">Configuración adaptada a la normativa LIVA española.</p>
        </div>

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
              <FormLabel className="font-bold text-slate-700">Dirección Fiscal Completa</FormLabel>
              <FormControl>
                <Input placeholder="Calle Ejemplo 123, 28001 Madrid" className="rounded-xl border-slate-200" {...field} />
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
                <FormLabel className="font-bold text-slate-700">Sector de Actividad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue placeholder="Selecciona tu sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="PROFESSIONAL">Profesional / Freelance</SelectItem>
                    <SelectItem value="CONSTRUCTION">Construcción y Reformas</SelectItem>
                    <SelectItem value="RETAIL_RE">Comercio (Recargo Eq.)</SelectItem>
                    <SelectItem value="HEALTH">Sanidad y Salud (Exento)</SelectItem>
                    <SelectItem value="EDUCATION">Educación y Formación (Exento)</SelectItem>
                    <SelectItem value="AGRICULTURE">Agricultura / Ganadería</SelectItem>
                    <SelectItem value="OTHER">Otros sectores</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-100">
          <FormField
            control={form.control}
            name="defaultVAT"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IVA por Defecto (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" className="bg-white border-slate-200" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                <FormLabel className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IRPF por Defecto (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" className="bg-white border-slate-200" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ALARMA DE RIESGO FISCAL */}
        {isTaxAlert && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
              <div className="flex flex-col gap-1 text-sm text-amber-800">
                <span className="font-bold">Aviso de Excepción Fiscal</span>
                <span className="opacity-90">
                  Has modificado el impuesto estándar para este sector. Según el reglamento de facturación, debes justificar el motivo para evitar sanciones.
                </span>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="taxNotes"
              render={({ field }) => (
                <FormItem className="animate-in fade-in duration-500">
                  <FormLabel className="font-bold text-slate-700">Justificación Legal (Obligatorio en auditorías)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Operación sujeta a Inversión del Sujeto Pasivo..." className="rounded-xl border-amber-200 focus:ring-amber-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-slate-900 hover:bg-black text-white py-7 rounded-2xl text-[15px] font-bold transition-all shadow-xl shadow-slate-900/10"
        >
          {isPending ? "Analizando y Guardando..." : "Confirmar Perfil Fiscal"}
        </Button>
      </form>
    </Form>
  );
}