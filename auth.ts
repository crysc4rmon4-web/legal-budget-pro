import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import GitHub from "next-auth/providers/github";

/**
 * CONFIGURACIÓN CENTRAL DE AUTENTICACIÓN - CARMONA STUDIO
 * Este archivo centraliza quién puede acceder a la app y cómo se vinculan
 * sus datos con el perfil de empresa (Company).
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    // Aquí podrías añadir Google, LinkedIn o Magic Links en el futuro
  ],
  callbacks: {
    // Vinculamos el ID de la base de datos a la sesión del usuario
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Redirecciones personalizadas para que la app se sienta fluida
  pages: {
    signIn: "/login", 
  },
});