import NextAuth, { NextAuthConfig } from "next-auth"; // <-- Añade NextAuthConfig aquí
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Añadimos : NextAuthConfig para que TypeScript sepa qué es
const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/");
      const isOnLoginPage = nextUrl.pathname.includes("/login");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);