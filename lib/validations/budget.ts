import { z } from "zod";

// Regex Oro: NIF, NIE y CIF (Estándar Agencia Tributaria)
const spanishIdRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$|^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/i;

export const clientSchema = z.object({
  name: z.string().min(2, "Razón social obligatoria"),
  nif: z.string().toUpperCase().regex(spanishIdRegex, "NIF/CIF no válido en España"),
  email: z.string().email("Email inválido"),
  address: z.string().min(5, "Dirección fiscal obligatoria"),
  phone: z.string().optional(),
});

export const budgetLineSchema = z.object({
  concept: z.string().min(1, "El concepto es obligatorio"),
  quantity: z.number().min(0.01, "Mínimo 0.01"),
  // Los precios se validan como floats aquí, pero se transforman a Cents antes de DB
  unitPrice: z.number().min(0, "Precio no negativo"),
  taxRate: z.union([z.literal(21), z.literal(10), z.literal(4), z.literal(0)]),
});

export const budgetSchema = z.object({
  clientId: z.string().uuid("ID de cliente inválido"),
  series: z.string().min(1).default("PRE"),
  budgetNumber: z.number().int().positive(),
  lines: z.array(budgetLineSchema).min(1, "El presupuesto debe tener contenido"),
  notes: z.string().optional(),
});

// Tipado estricto para inferencia en Client & Server Components
export type ClientInput = z.infer<typeof clientSchema>;
export type BudgetLineInput = z.infer<typeof budgetLineSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;