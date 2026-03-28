// app/actions/company.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { companySchema, type CompanySchema } from "@/lib/validations/company"; 
import { revalidatePath } from "next/cache";

export async function upsertCompany(data: CompanySchema) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    // Validamos los datos con Zod antes de tocar la DB
    const validatedData = companySchema.parse(data);

    const result = await prisma.company.upsert({
      where: { userId: session.user.id },
      update: { ...validatedData },
      create: { 
        ...validatedData, 
        userId: session.user.id 
      },
    });

    console.log(`✅ Empresa configurada: ${result.name} (Sector: ${result.sector})`);
    
    // Forzamos a Next.js a refrescar todos los datos de la app
    revalidatePath("/", "layout");
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error("UPSERT_COMPANY_ERROR:", error);
    return { 
      success: false, 
      error: error.message || "Error al procesar los datos fiscales." 
    };
  }
}