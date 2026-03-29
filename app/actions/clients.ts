"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clientSchema, ClientFormValues } from "@/lib/validations/client";
import { revalidatePath } from "next/cache";

export async function createClient(data: ClientFormValues) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Sesión expirada o no autorizada" };

    // 1. Validar datos
    const validatedData = clientSchema.parse(data);

    // 2. Obtener la empresa del usuario (Obligatorio por nuestro Schema)
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id }
    });

    if (!company) return { success: false, error: "Primero debes configurar tu perfil de empresa" };

    // 3. Comprobar si este cliente YA existe PARA ESTA EMPRESA (Multi-tenant)
    const existing = await prisma.client.findFirst({
      where: { nif: validatedData.nif, companyId: company.id }
    });

    if (existing) return { success: false, error: "Ya tienes un cliente registrado con este NIF" };

    // 4. Crear cliente vinculado
    await prisma.client.create({
      data: {
        ...validatedData,
        companyId: company.id
      }
    });

    revalidatePath("/[locale]/clientes", "page");
    return { success: true };
  } catch (error) {
    console.error("CRITICAL_ERROR_CLIENTS:", error);
    return { success: false, error: "Fallo técnico al procesar el registro" };
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