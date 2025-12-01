import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "../../../../lib/session";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

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

    // Default available roles based on selected role
    let availableRoles = [role || "creator"];
    
    // Admin gets all roles
    if (role === "admin") {
      availableRoles = ["admin", "manager", "creator", "analyst", "client"];
    }
    // Manager gets manager, creator, analyst, client
    else if (role === "manager") {
      availableRoles = ["manager", "creator", "analyst", "client"];
    }
    // Creator gets creator and analyst
    else if (role === "creator") {
      availableRoles = ["creator", "analyst"];
    }
    // Analyst only gets analyst
    else if (role === "analyst") {
      availableRoles = ["analyst"];
    }
    // Client only gets client
    else if (role === "client") {
      availableRoles = ["client"];
    }

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: role || "creator",
        availableRoles,
        bio: "",
        company: "",
        location: "",
        website: "",
      })
      .returning();

    // Set session
    await setSession(user.email, user.role, availableRoles);

    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          availableRoles,
          image: user.image,
          bio: user.bio,
          company: user.company,
          location: user.location,
          website: user.website,
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