import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Check admin-only routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/?error=unauthorized_admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes
        if (
          pathname === "/" ||
          pathname === "/scrims" ||
          pathname.startsWith("/scrims/") ||
          pathname === "/teams" ||
          pathname.startsWith("/teams/") ||
          pathname === "/login" ||
          pathname.startsWith("/api/auth")
        ) {
          return true;
        }

        // Protected routes require valid login token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/teams/create",
    "/my-registrations/:path*",
    "/profile/:path*",
  ],
};
