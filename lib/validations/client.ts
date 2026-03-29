import * as z from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  nif: z.string().regex(/^[0-9ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/i, "NIF/CIF/NIE con formato incorrecto"),
  email: z.string().email("Correo electrónico no válido"),
  address: z.string().min(5, "La dirección completa es obligatoria para la validez legal"),
  phone: z.string().optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;