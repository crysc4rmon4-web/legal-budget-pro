import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// 1. Inicializamos el middleware de idiomas
const intlMiddleware = createIntlMiddleware(routing);

// 2. Envolvemos con la protección de sesión
export default auth((req) => {
  const isLogged = !!req.auth;
  const { nextUrl } = req;

  // Rutas que no requieren sesión
  const isPublicRoute = 
    nextUrl.pathname.includes('/login') || 
    nextUrl.pathname === '/' ||
    nextUrl.pathname.includes('/api/auth');

  // Si es privada y no hay sesión, bloqueamos en el Edge
  if (!isPublicRoute && !isLogged) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Si pasa la seguridad, delegamos la ruta al sistema de idiomas
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Se salta internos, API y estáticos. Protege el resto.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};