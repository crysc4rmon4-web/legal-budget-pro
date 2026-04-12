import * as z from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  nif: z.string().toUpperCase().min(9, "Formato incompleto").max(9, "Formato incorrecto"),
  email: z.string().email("Email no válido"),
  address: z.string().min(5, "Dirección obligatoria"),
  phone: z.string().optional().or(z.literal("")),
  clientType: z.enum(["B2B", "B2C"]),
  taxLocation: z.enum(["ESPAÑA", "CANARIAS", "UE", "EXTRA"]),
  hasIRPF: z.boolean(), // Sin .optional() para que TypeScript no sufra
  isReverseCharge: z.boolean(), // Sin .optional()
});

export type ClientFormValues = z.infer<typeof clientSchema>;