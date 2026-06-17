import { NextResponse, type NextRequest } from "next/server";

const DASHBOARD_PATH_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("aa_access_token")?.value;

  if (!token && pathname.startsWith(DASHBOARD_PATH_PREFIX)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
