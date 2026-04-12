import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  return intlMiddleware(req);
  const { nextUrl } = req;
  const isLogged = !!req.auth;
  // @ts-ignore - Accedemos a la empresa si el adapter de Auth.js la incluye en la sesión
  const hasCompany = !!req.auth?.user?.hasCompany; 

  const segments = nextUrl.pathname.split('/');
  const locale = routing.locales.includes(segments as any) ? segments : 'es';

  if (nextUrl.pathname.includes(',')) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl.origin));
  }

  const isAuthApi = nextUrl.pathname.startsWith('/api/auth');
  const isLoginPage = nextUrl.pathname.includes('/login');
  const isOnboardingPage = nextUrl.pathname.includes('/onboarding');

  // 1. Manejo de Raíz '/'
  if (nextUrl.pathname === '/') {
    const path = isLogged ? `/${locale}` : `/${locale}/login`;
    return NextResponse.redirect(new URL(path, nextUrl.origin));
  }

  // 2. Si NO está logueado, a login (excepto APIs de auth)
  if (!isLogged && !isAuthApi && !isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl.origin));
  }

  // 3. Si está logueado y va a Login, al Dashboard
  if (isLogged && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, nextUrl.origin));
  }

  // --- LÓGICA DE ONBOARDING ---
  // Si está logueado, no tiene empresa y no está en la página de onboarding -> Forzar Onboarding
  if (isLogged && !hasCompany && !isOnboardingPage && !isAuthApi) {
    // COMENTA ESTA LÍNEA SI QUIERES DESACTIVAR EL FORZADO TEMPORALMENTE
    // return NextResponse.redirect(new URL(`/${locale}/onboarding`, nextUrl.origin));
  }

  // 4. Si todo está correcto, procesar con intl
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};