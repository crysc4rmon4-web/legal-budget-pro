import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aquí irá la lógica de validación con bcrypt más adelante
        return null; 
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Limpieza total de comas y redirección segura
      if (url.includes(',')) {
        const cleanPath = url.split(',').pop() || "/";
        return cleanPath.startsWith("/") ? `${baseUrl}${cleanPath}` : baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Forzamos nuestra página personalizada
  },
});