// lib/validations/company.ts
import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(3, "Razón social obligatoria."),
  nif: z.string().regex(
    /^[0-9XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[ABCDEFGHJNPQRSTUVW][0-9]{7}[0-9A-J]$/i,
    "NIF/CIF inválido según estándar AEAT."
  ),
  address: z.string().min(10, "Dirección fiscal completa requerida."),
  email: z.string().email("Email corporativo inválido."),
  phone: z.string().optional(),
});

export type CompanySchema = z.infer<typeof companySchema>;