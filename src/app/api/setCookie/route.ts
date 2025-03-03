import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { accessToken } = await req.json();

  if (!accessToken) {
    return NextResponse.json(
      { message: "Access token is required" },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    { message: "Cookie set successfully" },
    { status: 200 }
  );
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
