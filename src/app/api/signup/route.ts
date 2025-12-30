import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "../../../../lib/session";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validate role
    const validRoles = ["admin", "manager", "creator", "analyst", "client"];
    const selectedRole = role || "creator";
    
    if (!validRoles.includes(selectedRole)) {
      return NextResponse.json(
        { error: "Invalid role selected" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // IMPORTANT: Users only get their selected role in availableRoles
    // No extra roles for regular users
    const availableRoles = [selectedRole];

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: selectedRole,
        availableRoles, // Only their selected role
        bio: "",
        company: "",
        location: "",
        website: "",
        credits: selectedRole === "creator" ? 100 : 0, // Give creators some initial credits
      })
      .returning();

    // Set session with only their role
    await setSession(user.email, user.role, availableRoles);

    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          availableRoles, // Only their selected role
        },
        message: "Account created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}