"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { createClient } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShieldCheck, Sparkles, Contact2, Globe2 } from "lucide-react";

export function AddClientForm() {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "", nif: "", email: "", address: "", phone: "",
      clientType: "B2B",
      taxLocation: "ESPAÑA",
      hasIRPF: false,
      isReverseCharge: false,
    },
  });

  // Observadores de estado
  const watchLocation = form.watch("taxLocation");
  const watchType = form.watch("clientType");
  const watchNif = form.watch("nif");
  const watchIRPF = form.watch("hasIRPF");

  // EFECTO DE INTELIGENCIA FISCAL: Auto-toggle del IRPF
  useEffect(() => {
    if (watchType === "B2B" && watchLocation === "ESPAÑA") {
      form.setValue("hasIRPF", true, { shouldValidate: true });
    } else {
      form.setValue("hasIRPF", false, { shouldValidate: true });
    }
  }, [watchType, watchLocation, form]);

  async function onSubmit(values: ClientFormValues) {
    const toastId = toast.loading("Guardando perfil en base de datos...");
    const result = await createClient(values);
    if (result.success) {
      toast.success("Cliente guardado y sincronizado con éxito", { id: toastId });
      form.reset();
    } else {
      toast.error(result.error || "Error al guardar el cliente", { id: toastId });
    }
  }

  const getFiscalRule = () => {
    if (watchLocation === "CANARIAS") return { iva: "IGIC (Exento)", nota: "Inversión del Sujeto Pasivo" };
    if (watchLocation === "UE") return { iva: "0% (ISP)", nota: "Operación Intracomunitaria" };
    if (watchLocation === "EXTRA") return { iva: "0% (Export)", nota: "Exención por Exportación" };
    return { iva: "21% (IVA)", nota: "Régimen General España" };
  };

  const docType = watchNif ? (/^[XYZ]/i.test(watchNif) ? "NIE" : /^[A-Z]/i.test(watchNif) ? "CIF" : "NIF") : "---";
  const fiscal = getFiscalRule();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
        
        {/* BLOQUE 1: IDENTIDAD LEGAL */}
        <div className="bg-zinc-50 p-5 md:p-6 rounded-[2rem] border border-zinc-200 shadow-sm transition-all">
          <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 mb-4">
            <ShieldCheck className="w-3 h-3"/> Identidad Legal
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Razón Social</FormLabel>
                <FormControl><Input placeholder="Ej: Tech Solutions S.L." className="h-12 bg-white rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nif" render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center mb-1">
                  <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Identificación</FormLabel>
                  <span className="text-[9px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-bold">{docType}</span>
                </div>
                <FormControl><Input placeholder="A1234567B" className="h-12 bg-white rounded-xl uppercase font-mono" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* BLOQUE 2: CONTACTO Y LOCALIZACIÓN */}
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-zinc-100 shadow-sm transition-all">
          <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 mb-4">
            <Contact2 className="w-3 h-3"/> Datos de Contacto
          </p>
          <div className="space-y-4 md:space-y-5">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Email de Facturación</FormLabel>
                <FormControl><Input placeholder="admin@empresa.com" className="h-12 bg-zinc-50/50" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Dirección Fiscal</FormLabel>
                  <FormControl><Input placeholder="Calle, Número, CP..." className="h-12 bg-zinc-50/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Teléfono (Opcional)</FormLabel>
                  <FormControl><Input placeholder="+34 600 000 000" className="h-12 bg-zinc-50/50" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </div>

        {/* BLOQUE 3: INTELIGENCIA FISCAL */}
        <div className="bg-zinc-50 p-5 md:p-6 rounded-[2rem] border border-zinc-200 shadow-sm space-y-5 transition-all">
          <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2">
            <Globe2 className="w-3 h-3"/> Configuración Tributaria
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <FormField control={form.control} name="clientType" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Perfil Fiscal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="h-12 bg-white"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="B2B">Empresa / Autónomo</SelectItem>
                    <SelectItem value="B2C">Particular</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="taxLocation" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Ubicación</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="h-12 bg-white"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="ESPAÑA">España Península</SelectItem>
                    <SelectItem value="CANARIAS">Canarias/Ceuta</SelectItem>
                    <SelectItem value="UE">Unión Europea</SelectItem>
                    <SelectItem value="EXTRA">Internacional</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>

          {/* LA CAJA MÁGICA CON SWITCH IRPF FUNCIONAL */}
          <div className="bg-zinc-900 text-white p-5 md:p-6 rounded-[1.5rem] shadow-xl relative overflow-hidden group">
            <Sparkles className="absolute -right-2 -top-2 w-16 h-16 text-white/5 group-hover:rotate-12 transition-transform" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">IVA Automático</p>
                <div className="text-3xl font-black tracking-tighter">{fiscal.iva}</div>
              </div>
              
              <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 w-full md:w-auto">
                <FormField control={form.control} name="hasIRPF" render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </FormControl>
                    <FormLabel className="text-[11px] font-bold uppercase cursor-pointer">
                      {watchIRPF ? <span className="text-green-400">Retención Activa</span> : <span className="text-zinc-400">Sin Retención</span>}
                    </FormLabel>
                  </FormItem>
                )} />
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[11px] text-zinc-400 font-medium">{fiscal.nota}</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-14 bg-zinc-900 hover:bg-black text-white rounded-[1rem] font-black text-base shadow-xl transition-all active:scale-[0.98]">
          Confirmar y Guardar Cliente
        </Button>
      </form>
    </Form>
  );
}