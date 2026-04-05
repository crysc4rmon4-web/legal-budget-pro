"use server"; // Esto asegura que la acción se ejecute en el servidor

import { signOut } from "@/auth";
import { LogOut } from "lucide-react";

export async function handleLogout() {
  await signOut({ redirectTo: "/login" });
}

// Nota: Puedes llamar a esta función desde cualquier botón 
// en tu Navbar.tsx usando un 'form action' o un 'startTransition'.