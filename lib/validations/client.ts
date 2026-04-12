import * as z from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  // Regex universal para España: NIF (DNI), NIE (Extranjeros) y CIF (Empresas)
  // Acepta letras al principio o al final, mayúsculas o minúsculas.
  nif: z.string().regex(/^[a-zA-Z0-9][0-9]{7}[a-zA-Z0-9]$/, "Formato de identificación incorrecto (NIF/CIF/NIE)"),
  email: z.string().email("Correo electrónico no válido"),
  address: z.string().min(5, "La dirección completa es obligatoria"),
  phone: z.string().optional().or(z.literal("")),
});

export type ClientFormValues = z.infer<typeof clientSchema>;