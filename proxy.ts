import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default auth((req) => {
  const isLogged = !!req.auth;
  const { nextUrl } = req;

  const isPublicRoute = 
    nextUrl.pathname.includes('/login') || 
    nextUrl.pathname === '/' ||
    nextUrl.pathname.includes('/api/auth');

  if (!isPublicRoute && !isLogged) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};