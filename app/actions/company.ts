// app/actions/company.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { companySchema, type CompanySchema } from "@/lib/validations/company"; // Verifica el path
import { revalidatePath } from "next/cache";

export async function upsertCompany(data: CompanySchema) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autorizado");

  const validatedData = companySchema.parse(data);

  try {
    const result = await prisma.company.upsert({
      where: { userId: session.user.id },
      update: { ...validatedData },
      create: { ...validatedData, userId: session.user.id },
    });
    revalidatePath("/", "layout");
    return { success: true, data: result };
  } catch (error) {
    console.error("UPSERT_COMPANY_ERROR", error);
    return { success: false, error: "Error en base de datos." };
  }
}