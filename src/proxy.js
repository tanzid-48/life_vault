import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // Dashboard guard
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(
        new URL(`/signin?redirect=${pathname}`, request.url)
      );
    }

    // Lesson detail guard
    if (pathname.match(/^\/lessons\/[^/]+/)) {
      return NextResponse.redirect(
        new URL(`/signin?redirect=${pathname}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/lessons/:path+"],
};