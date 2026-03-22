import { auth } from "@/auth"; // Tu configuración de Auth.js v5
import createIntlMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  // 1. Ejecutamos el middleware de internacionalización primero
  return intlMiddleware(req);
});

export const config = {
  // Matcher optimizado: protege todo excepto archivos estáticos, imágenes y API pública
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};