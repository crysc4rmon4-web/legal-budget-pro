import { z } from "zod";

/**
 * Este es el "Escudo" de validación. 
 * Define exactamente qué datos permitimos y qué formato deben tener.
 */
export const budgetSchema = z.object({
  // El número de presupuesto debe ser obligatorio y único (Ej: 2026-001)
  budgetNumber: z.string().min(1, "La numeración es obligatoria para cumplir la ley"),
  
  // Datos del cliente con validaciones específicas
  clientName: z.string().min(2, "El nombre del cliente es demasiado corto"),
  clientNIF: z.string().regex(/^[0-9A-Z][0-9]{7}[A-Z]$/i, "El formato del NIF/CIF no es válido en España"),
  clientEmail: z.string().email("Introduce un correo electrónico válido"),
  
  // Array de líneas del presupuesto (Conceptos)
  items: z.array(
    z.object({
      description: z.string().min(1, "La descripción del concepto es obligatoria"),
      quantity: z.number().positive("La cantidad debe ser mayor a 0"),
      unitPrice: z.number().min(0, "El precio unitario no puede ser negativo"),
      taxRate: z.number().default(21), // IVA por defecto en España
    })
  ).min(1, "El presupuesto debe tener al menos un concepto"),
  
  // Totales (Se calculan en el servidor, pero los validamos aquí)
  subtotal: z.number(),
  taxAmount: z.number(),
  total: z.number(),
});

// Esto extrae el tipo de TypeScript automáticamente para usarlo en toda la app
export type BudgetFormValues = z.infer<typeof budgetSchema>;