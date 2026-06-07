import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  // token is null if: no cookie, expired cookie, tampered cookie
  // token is the payload object if valid: { id, role, name, email }

  const { pathname } = req.nextUrl;
// e.g. "/dashboard" or "/login"
  const protectedRoutes = [
    "/dashboard",
    "/properties",
    "/wishlist",
    "/appointments",
    "/profile",
  ];

  const authRoutes = ["/login", "/register"];

  // Step 2 — is this a page that needs login?
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  
   // Step 3 — if protected and no valid token → send to login
   const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

    // Step 4 — if already logged in and trying to visit login/register
  // → send to dashboard (no point showing login to logged-in user)
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};