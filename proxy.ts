// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const userCookie = request.cookies.get("user_id")?.value;
  const { pathname } = request.nextUrl;

  // 1. Biarkan user akses halaman login
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // 2. Jika tidak ada cookie, lempar ke /login
  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
