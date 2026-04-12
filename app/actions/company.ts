"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { companySchema, type CompanySchema } from "@/lib/validations/company";
import { revalidatePath } from "next/cache";

export async function upsertCompany(data: CompanySchema) {
  try {
    // 1. Seguridad: Verificar sesión
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "No autorizado. Inicia sesión de nuevo." };
    }

    // 2. Validación Blindada
    const validatedData = companySchema.safeParse(data);
    
    if (!validatedData.success) {
      // Usamos .flatten() que es el método más robusto de Zod para extraer mensajes
      // Esto devuelve un objeto donde 'formErrors' es siempre un array de strings
      const errorMessages = validatedData.error.flatten().formErrors;
      
      return { 
        success: false, 
        error: errorMessages || "Error de validación en los campos" 
      };
    }

    // 3. Operación Atómica en DB con trazabilidad
    const result = await prisma.company.upsert({
      where: { userId: session.user.id },
      update: {
        ...validatedData.data,
      },
      create: {
        ...validatedData.data,
        userId: session.user.id,
      },
    });

    console.log(`✅ Empresa configurada: ${result.name} (Sector: ${result.sector}, Régimen: ${result.regime})`);

    // 4. Refrescar caché de forma global para desbloquear el acceso a "/"
    revalidatePath("/", "layout");

    return { success: true, data: result };
    
  } catch (error: any) {
    console.error("UPSERT_COMPANY_ERROR:", error);

    // Manejo específico para errores de base de datos (NIF ya en uso)
    if (error.code === 'P2002') {
      return { success: false, error: "Este NIF ya está registrado en el sistema." };
    }

    return { 
      success: false, 
      error: "Error interno al guardar los datos fiscales." 
    };
  }
}