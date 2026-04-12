"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { createClient } from "@/app/actions/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  async function onSubmit(values: ClientFormValues) {
    const toastId = toast.loading("Guardando en base de datos...");
    const result = await createClient(values);
    if (result.success) {
      toast.success("Cliente blindado y guardado con éxito", { id: toastId });
      form.reset();
    } else {
      toast.error(result.error || "Error al guardar el cliente", { id: toastId });
    }
  }

  const watchLocation = form.watch("taxLocation");
  const watchNif = form.watch("nif");
  const watchType = form.watch("clientType");

  const getFiscalRule = () => {
    if (watchLocation === "CANARIAS") return { iva: "IGIC (Exento)", nota: "Inversión del Sujeto Pasivo" };
    if (watchLocation === "UE") return { iva: "0% (ISP)", nota: "Operación Intracomunitaria" };
    if (watchLocation === "EXTRA") return { iva: "0% (Export)", nota: "Exención por Exportación" };
    return { iva: "21% (IVA)", nota: "Régimen General España" };
  };

  const docType = watchNif ? (/^[XYZ]/i.test(watchNif) ? "NIE" : /^[A-Z]/i.test(watchNif) ? "CIF" : "NIF") : "---";
  const fiscal = getFiscalRule();
  
  // LÓGICA VISUAL: Si es Empresa (B2B) en España, lleva IRPF. Si es Particular (B2C), NO lleva.
  const isSujetoIRPF = watchType === "B2B" && watchLocation === "ESPAÑA";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* BLOQUE 1: IDENTIDAD LEGAL */}
        <div className="bg-zinc-50 p-5 rounded-[2.5rem] border border-zinc-200 space-y-4 shadow-sm">
          <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 mb-2">
            <ShieldCheck className="w-3 h-3"/> Identidad Legal
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Razón Social</FormLabel>
                <FormControl><Input placeholder="Ej: Tech Solutions S.L." className="h-12 bg-white rounded-xl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="nif" render={({ field }) => (
              <FormItem>
                <div className="flex justify-between"><FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Identificación</FormLabel><span className="text-[9px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-bold">{docType}</span></div>
                <FormControl><Input placeholder="A1234567B" className="h-12 bg-white rounded-xl uppercase font-mono" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* BLOQUE 2: CONTACTO Y LOCALIZACIÓN */}
        <div className="bg-white p-5 rounded-[2.5rem] border border-zinc-100 space-y-4 shadow-sm">
          <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2 mb-2">
            <Contact2 className="w-3 h-3"/> Datos de Contacto
          </p>
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Email de Facturación</FormLabel>
              <FormControl><Input placeholder="admin@empresa.com" className="h-12 bg-zinc-50/50" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Dirección Fiscal</FormLabel>
                <FormControl><Input placeholder="Calle, Número, CP..." className="h-12 bg-zinc-50/50" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* AQUÍ VUELVE EL TELÉFONO */}
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Teléfono (Opcional)</FormLabel>
                <FormControl><Input placeholder="+34 600 000 000" className="h-12 bg-zinc-50/50" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
        </div>

        {/* BLOQUE 3: INTELIGENCIA FISCAL */}
        <div className="bg-zinc-50 p-6 rounded-[2.5rem] border-2 border-zinc-900/5 space-y-5">
          <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-2">
            <Globe2 className="w-3 h-3"/> Configuración Tributaria
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="clientType" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold text-zinc-500 uppercase">Perfil</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger className="h-11 bg-white"><SelectValue /></SelectTrigger></FormControl>
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
                  <FormControl><SelectTrigger className="h-11 bg-white"><SelectValue /></SelectTrigger></FormControl>
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

          {/* LA CAJA MÁGICA AHORA REACCIONA AL IRPF */}
          <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <Sparkles className="absolute -right-2 -top-2 w-16 h-16 text-white/5 group-hover:rotate-12 transition-transform" />
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Cálculo Automático</p>
                <div className="text-3xl font-black tracking-tighter">{fiscal.iva}</div>
              </div>
              
              <div className="text-right">
                {isSujetoIRPF ? (
                  <span className="text-[10px] bg-green-500 text-zinc-900 px-3 py-1.5 rounded-xl font-black uppercase flex items-center gap-1 shadow-lg shadow-green-500/20">
                    + Aplica Retención
                  </span>
                ) : (
                  <span className="text-[10px] bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-xl font-bold uppercase">
                    Sin Retención
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[11px] text-zinc-500 font-medium">{fiscal.nota}</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full h-16 bg-zinc-900 hover:bg-black text-white rounded-[1.5rem] font-black text-lg shadow-2xl transition-all transform active:scale-95">
          Guardar Perfil y Activar Cliente
        </Button>
      </form>
    </Form>
  );
}