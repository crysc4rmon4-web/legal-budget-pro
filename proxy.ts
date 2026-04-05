import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  const { nextUrl } = req;
  const isLogged = !!req.auth;

  // 1. Detectar el locale de forma correcta (tomando el primer segmento después de la /)
  const segments = nextUrl.pathname.split('/');
  const locale = routing.locales.includes(segments as any) ? segments : 'es';

  // 2. Limpiar la URL de posibles comas cacheadas
  if (nextUrl.pathname.includes(',')) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl.origin));
  }

  // 3. Definir rutas
  const isAuthApi = nextUrl.pathname.startsWith('/api/auth');
  const isLoginPage = nextUrl.pathname.includes('/login');

  // 4. LÓGICA ANTI-BUCLES 
  // Si entra a la raíz pura '/'
  if (nextUrl.pathname === '/') {
    const path = isLogged ? `/${locale}` : `/${locale}/login`;
    return NextResponse.redirect(new URL(path, nextUrl.origin));
  }

  // Si YA está logueado y trata de ir al login, lo sacamos al Dashboard
  if (isLogged && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl.origin));
  }

  // 5. Proteger rutas privadas (Si NO está logueado, NO es API de auth, y NO es login)
  if (!isLogged && !isAuthApi && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl.origin));
  }

  // 6. Si todo está correcto, dejamos que next-intl renderice la página
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};