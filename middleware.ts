import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Solo aplicar a rutas internacionales, ignorar archivos estáticos o la API
  matcher: ['/', '/(es|en)/:path*']
};