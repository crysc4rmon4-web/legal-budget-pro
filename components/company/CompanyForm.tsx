"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanySchema } from "@/lib/validations/company";
import { upsertCompany } from "@/app/actions/company";
import { useState } from "react";

export default function CompanyForm({ initialData }: { initialData?: Partial<CompanySchema> }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CompanySchema>({
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

  const selectedSector = watch("sector");

  const onSubmit = async (data: CompanySchema) => {
    setLoading(true);
    const result = await upsertCompany(data);
    if (result.success) {
      window.location.href = "/"; 
    } else {
      alert(result.error || "Ocurrió un error al guardar.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Configuración Fiscal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Razón Social</label>
          <input {...register("name")} className="w-full p-2 border rounded-md" placeholder="Ej: Reformas Carmona S.L." />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">NIF / CIF</label>
          <input {...register("nif")} className="w-full p-2 border rounded-md" placeholder="B12345678" />
          {errors.nif && <p className="text-red-500 text-xs mt-1">{errors.nif.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Dirección Fiscal Completa</label>
        <input {...register("address")} className="w-full p-2 border rounded-md" placeholder="Calle Ejemplo 123, 28001 Madrid" />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email de Facturación</label>
        <input type="email" {...register("email")} className="w-full p-2 border rounded-md" placeholder="admin@empresa.com" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Sector de Actividad</label>
        <select {...register("sector")} className="w-full p-2 border rounded-md bg-slate-50">
          <option value="CONSTRUCTION">Construcción y Reformas</option>
          <option value="CONSULTING">Consultoría / Freelance</option>
          <option value="RETAIL">Comercio / Tienda</option>
          <option value="HEALTH">Salud y Bienestar</option>
          <option value="OTHER">Otros sectores</option>
        </select>
        {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector.message}</p>}
        {selectedSector === "CONSULTING" && (
          <p className="text-blue-600 text-xs mt-2">💡 Sugerencia: Como consultor, recuerda que podrías aplicar un 15% o 7% de IRPF.</p>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">IVA por defecto (%)</label>
          {/* Solución en el Frontend: valueAsNumber inyecta un número real, no un string */}
          <input type="number" step="0.1" {...register("defaultVAT", { valueAsNumber: true })} className="w-full p-2 border rounded-md" />
          {errors.defaultVAT && <p className="text-red-500 text-xs mt-1">{errors.defaultVAT.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">IRPF por defecto (%)</label>
          <input type="number" step="0.1" {...register("defaultIRPF", { valueAsNumber: true })} className="w-full p-2 border rounded-md" />
          {errors.defaultIRPF && <p className="text-red-500 text-xs mt-1">{errors.defaultIRPF.message}</p>}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white p-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors mt-6"
      >
        {loading ? "Guardando..." : "Finalizar Configuración"}
      </button>
    </form>
  );
}