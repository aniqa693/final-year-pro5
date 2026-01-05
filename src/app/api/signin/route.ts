import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Check password
    const isValid = await bcrypt.compare(password, user[0].password || "");

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Get available roles from database
    const availableRoles = user[0].availableRoles || [user[0].role];

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user[0].id, 
          name: user[0].name, 
          email: user[0].email, 
          role: user[0].role,
          availableRoles,
        },
        message: "Signed in successfully" 
      }
    );

    // Set cookies that will be accessible in server-side API routes
    response.cookies.set({
      name: 'user-email',
      value: user[0].email,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    response.cookies.set({
      name: 'user-role',
      value: user[0].role,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set({
      name: 'user-id',
      value: user[0].id.toString(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Also set in localStorage via client-side will be handled in frontend
    return response;

  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}