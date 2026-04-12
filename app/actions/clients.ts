"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { revalidatePath } from "next/cache";

export async function createClient(data: ClientFormValues) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const validatedData = clientSchema.parse(data);

    const company = await prisma.company.findUnique({
      where: { userId: session.user.id }
    });

    if (!company) return { success: false, error: "Configura tu empresa primero" };

    // Comprobar NIF duplicado SOLO para esta empresa
    const existing = await prisma.client.findFirst({
      where: { nif: validatedData.nif, companyId: company.id }
    });

    if (existing) return { success: false, error: "Ya tienes un cliente con este NIF" };

    await prisma.client.create({
      data: {
        ...validatedData,
        companyId: company.id
      }
    });

    revalidatePath("/[locale]/clientes"); 
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al registrar cliente" };
  }
}

export async function getMyClients() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.client.findMany({
    where: { company: { userId: session.user.id } },
    orderBy: { createdAt: "desc" }
  });
}