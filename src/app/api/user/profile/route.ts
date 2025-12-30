//api/user/profile/route.ts

import { db } from "../../../../../lib/db";
import { users } from "../../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession,clearSession,setSession } from "../../../../../lib/session";

// GET - Get user profile
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, session.email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
        availableRoles: user[0].availableRoles || [user[0].role],
        image: user[0].image,
        bio: user[0].bio,
        company: user[0].company,
        location: user[0].location,
        website: user[0].website,
        createdAt: user[0].createdAt,
        updatedAt: user[0].updatedAt,
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update user profile (including available roles for admins)
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    // Get current user
    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session.email))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.email, session.email))
      .returning();

    // Update session if available roles changed
    if (updates.availableRoles) {
      await setSession(updatedUser.email, updatedUser.role, updates.availableRoles);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        availableRoles: updatedUser.availableRoles || [updatedUser.role],
        image: updatedUser.image,
        bio: updatedUser.bio,
        company: updatedUser.company,
        location: updatedUser.location,
        website: updatedUser.website,
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete user account
export async function DELETE() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user from database
    await db
      .delete(users)
      .where(eq(users.email, session.email));

    // Clear session
    await clearSession();

    return NextResponse.json({ 
      success: true, 
      message: "Account deleted successfully" 
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}