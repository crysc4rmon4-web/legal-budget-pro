import { withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default withAuth(
  function middleware(req) {
    // Ejecuta el middleware de idiomas si la sesión es válida
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login', // Ajusta según tu ruta
    }
  }
);

export const config = {
  // Proteger dashboard y asegurar i18n, ignorando estáticos y API interna
  matcher: ['/((?!api|_next|.*\\..*).*)', '/(es|en)/:path*']
};