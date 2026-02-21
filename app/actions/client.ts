"use server";

import { prisma } from "@/lib/prisma"; // Asegúrate de tener este archivo creado (lo haremos ahora)
import { clientSchema, ClientInput } from "@/lib/validations/budget.ts";
import { revalidatePath } from "next/cache";

/**
 * MOTOR DE GESTIÓN DE CLIENTES - CARMONA STUDIO
 * Este archivo maneja la persistencia de datos con integridad legal.
 */

export async function createClient(data: ClientInput) {
  try {
    // 1. Validamos los datos de nuevo en el servidor (Seguridad doble)
    const validatedData = clientSchema.parse(data);

    // 2. Comprobamos si el NIF ya existe para evitar duplicados
    const existingClient = await prisma.client.findUnique({
      where: { nif: validatedData.nif },
    });

    if (existingClient) {
      return { success: false, error: "Ya existe un cliente registrado con este NIF/NIE/CIF" };
    }

    // 3. Insertamos en la base de datos
    const newClient = await prisma.client.create({
      data: validatedData,
    });

    // 4. Limpiamos la caché de la página de clientes para que aparezca el nuevo
    revalidatePath("/clientes");
    
    return { success: true, data: newClient };
  } catch (error) {
    console.error("Error en createClient:", error);
    return { success: false, error: "Error interno al guardar el cliente. Revisa los datos." };
  }
}

export async function getClients() {
  try {
    return await prisma.client.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error en getClients:", error);
    return [];
  }
}

export async function getClientById(id: string) {
  try {
    return await prisma.client.findUnique({
      where: { id },
    });
  } catch (error) {
    return null;
  }
}