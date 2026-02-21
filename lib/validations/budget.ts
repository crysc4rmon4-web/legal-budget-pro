import { z } from "zod";

/**
 * ESQUEMA DE VALIDACIÓN - CARMONA STUDIO
 * Este archivo es el "portero" de la aplicación. 
 * Si un dato no pasa por aquí, no entra a la base de datos.
 */

// Validación de los datos del cliente
export const clientSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto"),
  nif: z.string().regex(/^[a-zA-Z0-9]{9}$/, "NIF/CIF español inválido"),
  email: z.string().email("Email no válido"),
  address: z.string().min(5, "La dirección debe ser más completa"),
  phone: z.string().optional(),
});

// Validación de cada línea del presupuesto
export const budgetLineSchema = z.object({
  concept: z.string().min(1, "El concepto no puede estar vacío"),
  quantity: z.number().min(1, "La cantidad mínima es 1"),
  unitPrice: z.number().min(0, "El precio no puede ser negativo"),
  taxRate: z.union([
    z.literal(21),
    z.literal(10),
    z.literal(4),
    z.literal(0)
  ]), // Solo permitimos tipos de IVA legales en España
});

// Esquema completo del Presupuesto
export const budgetSchema = z.object({
  clientId: z.string().min(1, "Debes seleccionar un cliente"),
  series: z.string().default("PRE"),
  budgetNumber: z.number().int(),
  lines: z.array(budgetLineSchema).min(1, "El presupuesto debe tener al menos una línea"),
});

// Tipos TypeScript extraídos de los esquemas (para usarlos en toda la app)
export type ClientInput = z.infer<typeof clientSchema>;
export type BudgetLineInput = z.infer<typeof budgetLineSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;