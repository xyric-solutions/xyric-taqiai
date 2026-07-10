import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PAGE_PATHS = new Set(["/", "/login", "/register", "/landing"]);
const PUBLIC_API_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/session",
]);
const PUBLIC_ASSET_EXTENSIONS =
  /\.(?:ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|txt|xml|json|webmanifest)$/i;
const JWT_SECRET_MIN_LENGTH = 32;
const JWT_SECRET_ERROR = `JWT_SECRET must be set to at least ${JWT_SECRET_MIN_LENGTH} characters`;

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PAGE_PATHS.has(pathname) || pathname.startsWith("/landing/")) {
    return true;
  }
  if (PUBLIC_API_PATHS.has(pathname)) {
    return true;
  }
  if (pathname.startsWith("/_next/")) {
    return true;
  }
  if (!pathname.startsWith("/api/") && PUBLIC_ASSET_EXTENSIONS.test(pathname)) {
    return true;
  }
  return false;
}

function getJwtSecretKey(): Uint8Array {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < JWT_SECRET_MIN_LENGTH) {
    throw new Error(JWT_SECRET_ERROR);
  }
  return new TextEncoder().encode(jwtSecret);
}

function isJwtConfigError(error: unknown): boolean {
  return error instanceof Error && error.message === JWT_SECRET_ERROR;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths and static assets
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Only protect dashboard pages (not API routes — those handle their own auth)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, getJwtSecretKey());
    return NextResponse.next();
  } catch (error) {
    if (isJwtConfigError(error)) {
      return NextResponse.json(
        { error: "Server auth is not configured." },
        { status: 500 }
      );
    }

    // Token invalid or expired — redirect to login
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
