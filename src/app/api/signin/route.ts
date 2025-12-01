import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "../../../../lib/session";

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

    // Get available roles from database or use default
    const availableRoles = user[0].availableRoles || [user[0].role];

    // Set session
    await setSession(user[0].email, user[0].role, availableRoles);

    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user[0].id, 
          name: user[0].name, 
          email: user[0].email, 
          role: user[0].role,
          availableRoles,
          image: user[0].image,
          bio: user[0].bio,
          company: user[0].company,
          location: user[0].location,
          website: user[0].website,
        },
        message: "Signed in successfully" 
      }
    );
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}