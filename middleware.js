import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

async function fetchUserData(uid, origin) {
  const res = await fetch(`${origin}/api/verifyUser?uid=${uid}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
}

async function handleAdminRoute(req, token) {
  try {
    const decodedToken = jwtDecode(token);
    const uid = decodedToken.user_id;
    const userData = await fetchUserData(uid, req.nextUrl.origin);

    if (!userData || userData.userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.error("Admin route middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

async function handleAuthRoute(req, token) {
  try {
    const decodedToken = jwtDecode(token);
    const uid = decodedToken.user_id;
    const userData = await fetchUserData(uid, req.nextUrl.origin);

    if (userData.userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (userData.userRole === "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.error("Auth route middleware error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token");

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return handleAdminRoute(req, token.value);
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      return handleAuthRoute(req, token.value);
    }
  }

  return NextResponse.next();
}
