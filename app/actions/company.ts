"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { companySchema, CompanySchema } from "@/lib/validations/company";
import { revalidatePath } from "next/cache";

export async function upsertCompany(data: CompanySchema) {
  const session = await auth();
  
  // Guard Clause: Seguridad en el Edge
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validación robusta de servidor
  const validatedData = companySchema.parse(data);

  try {
    const company = await prisma.company.upsert({
      where: { userId: session.user.id },
      update: { ...validatedData },
      create: { 
        ...validatedData, 
        userId: session.user.id 
      },
    });

    revalidatePath("/", "layout");
    return { success: true, data: company };
  } catch (error) {
    return { success: false, error: "Fallo crítico en persistencia de datos fiscales." };
  }
}