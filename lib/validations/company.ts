import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "Razón social obligatoria."),
  
  nif: z.string().regex(
    /^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[ABCDEFGHJNPQRSTUVW][0-9]{7}[0-9A-J]$/i, 
    "NIF/CIF inválido en España."
  ),
  
  address: z.string().min(10, "Dirección fiscal completa requerida."),
  
  email: z.string().email("Email corporativo inválido."),
  
  // Sectores ampliados con rigor legal
  sector: z.enum([
    "PROFESSIONAL", 
    "CONSTRUCTION", 
    "HEALTH", 
    "EDUCATION", 
    "RETAIL_RE", 
    "AGRICULTURE", 
    "OTHER"
  ], {
    message: "Selecciona un sector de actividad válido."
  }),

  // Régimen fiscal base para automatizar el cumplimiento
  regime: z.enum([
    "GENERAL", 
    "EQUIVALENCE_SURCHARGE", 
    "CASH_BASIS", 
    "EXEMPT"
  ], {
    message: "Selecciona un régimen fiscal válido."
  }),
  
  defaultVAT: z
    .number({ message: "El IVA debe ser un número." })
    .min(0, "El IVA mínimo es 0")
    .max(100, "El IVA máximo es 100"),
    
  defaultIRPF: z
    .number({ message: "El IRPF debe ser un número." })
    .min(0, "El IRPF mínimo es 0")
    .max(100, "El IRPF máximo es 100"),

  // Campo clave para justificar alteraciones manuales de impuestos
  taxNotes: z.string().optional(),
});

export type CompanySchema = z.infer<typeof companySchema>;