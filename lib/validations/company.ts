import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "Razón social obligatoria."),
  nif: z.string().regex(/^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[ABCDEFGHJNPQRSTUVW][0-9]{7}[0-9A-J]$/i, "NIF/CIF inválido en España."),
  address: z.string().min(10, "Dirección fiscal completa requerida."),
  email: z.string().email("Email corporativo inválido."),
  
  // Lógica de sectores para automatizar impuestos
  sector: z.enum(["CONSTRUCTION", "CONSULTING", "RETAIL", "HEALTH", "OTHER"], {
    errorMap: () => ({ message: "Selecciona un sector de actividad." }),
  }),
  
  // Valores por defecto para agilizar presupuestos
  defaultVAT: z.number().min(0).max(21).default(21),
  defaultIRPF: z.number().min(0).max(20).default(0),
});

export type CompanySchema = z.infer<typeof companySchema>;