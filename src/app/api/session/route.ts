import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore =await cookies();
    const userRole = cookieStore.get("user-role")?.value;

    if (!userRole) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        role: userRole,
        name: "User",
        email: "user@example.com",
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}