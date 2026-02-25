import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/chat'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = Boolean(accessToken);

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));
  const isAuthPage = pathname === '/' || pathname.startsWith('/get-started');

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/get-started', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && isAuthenticated) {
    const chatUrl = new URL('/chat/new', request.url);
    return NextResponse.redirect(chatUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'],
};
