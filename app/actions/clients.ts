"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { revalidatePath } from "next/cache";

// Acción para crear
export async function createClient(data: ClientFormValues) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "No autorizado" };

    const validatedData = clientSchema.parse(data);

    const company = await prisma.company.findUnique({
      where: { userId: session.user.id }
    });

    if (!company) return { success: false, error: "Configura tu empresa primero" };

    const existing = await prisma.client.findFirst({
      where: { nif: validatedData.nif, companyId: company.id }
    });

    if (existing) return { success: false, error: "Este NIF ya está en tu cartera" };

    await prisma.client.create({
      data: {
        ...validatedData,
        companyId: company.id
      }
    });

    revalidatePath("/[locale]/clientes");
    return { success: true };
  } catch (error) {
    console.error("CREATE_CLIENT_ERROR:", error);
    return { success: false, error: "Error de validación fiscal" };
  }
}

// ESTA ES LA FUNCIÓN QUE TE FALTA Y ROMPE EL BUILD
export async function getMyClients() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return await prisma.client.findMany({
    where: { company: { userId: session.user.id } },
    orderBy: { createdAt: "desc" }
  });
}