import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  // If the user is not authenticated and is trying to access a protected route
  if (!accessToken) {
    return NextResponse.redirect(new URL("/register", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/chat/:path*',
    '/coupons',
    '/games',
    '/fun',
  ],
};
