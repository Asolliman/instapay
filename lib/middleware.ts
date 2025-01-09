import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const token = req.headers.get("cookie")?.match(/token=([^;]+)/)?.[1];

  // Redirect to login if no token exists
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard", "/other-protected-route"],
};
