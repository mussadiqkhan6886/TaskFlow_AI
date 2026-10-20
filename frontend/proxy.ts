import { jwtVerify, errors } from "jose";
import { NextRequest, NextResponse } from "next/server";

export const proxy = async (req: NextRequest) => {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!accessToken && refreshToken) {
    return await refreshAccessToken(req);
  }

  try {
    await jwtVerify(
      accessToken as string,
      new TextEncoder().encode(process.env.ACCESS_TOKEN)
    );

    return NextResponse.next();
  } catch (error) {
    if (!(error instanceof errors.JWTExpired)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return await refreshAccessToken(req);
  }
};

async function refreshAccessToken(req: NextRequest) {
  const refreshRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`,
    {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    }
  );

  if (!refreshRes.ok) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();

  const setCookie = refreshRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.append("set-cookie", setCookie);
  }

  return response;
}

export const config = {
  matcher: "/admin/:path*",
};