import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/actions.json") {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  return NextResponse.next();
}
