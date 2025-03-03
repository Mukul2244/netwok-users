import { NextRequest, NextResponse } from "next/server";
import{ axiosInstance } from "@/lib/axios";

export async function GET(req: NextRequest) {
  const { refresh } = await req.json();

  if (!refresh) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Send request to Django backend to refresh token
    const response = await axiosInstance.post("/api/token/refresh/", {
      refresh
    });

    const { access } = response.data;

    // Create a new response object to set the cookie
    const res = NextResponse.json({ success: true });
    res.cookies.set("accessToken", access, {
      httpOnly: true,
      secure:true,
      sameSite: "lax",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json({ message: "Refresh token invalid or expired" }, { status: 401 });
  }
}
