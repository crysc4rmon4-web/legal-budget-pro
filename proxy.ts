import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  const { nextUrl } = req;
  const isLogged = !!req.auth;

  // 1. Detectar el locale de forma ultra-segura
  const segments = nextUrl.pathname.split('/');
  const locale = routing.locales.includes(segments as any) ? segments : 'es';

  // 2. Limpiar la URL de posibles comas que el navegador haya guardado en caché
  if (nextUrl.pathname.includes(',')) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl.origin));
  }

  // 3. Definir rutas
  const isAuthApi = nextUrl.pathname.startsWith('/api/auth');
  const isLoginPage = nextUrl.pathname.includes('/login');

  // 4. Redirección inteligente (Sin usar arrays)
  if (nextUrl.pathname === '/' || nextUrl.pathname === `/${locale}` || nextUrl.pathname === `/${locale}/`) {
    const path = isLogged ? `/${locale}/dashboard` : `/${locale}/login`;
    return NextResponse.redirect(new URL(path, nextUrl.origin));
  }

  // 5. Proteger rutas privadas
  if (!isLogged && !isAuthApi && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl.origin));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};