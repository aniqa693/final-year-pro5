// app/api/user/switch-role/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get cookies
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;
    const originalRole = cookieStore.get('original-role')?.value;
    
    console.log("🔧 Switch role API called at /api/user/switch-role");
    console.log("🔧 Current user role from cookie:", userRole);
    console.log("🔧 Original role from cookie:", originalRole);
    console.log("🔧 All cookies:", cookieStore.getAll());

    if (!userRole) {
      console.log("❌ No user role found in cookies");
      return NextResponse.json({ 
        error: "Unauthorized - No user role found" 
      }, { status: 401 });
    }

    const { newRole } = await request.json();
    console.log(`🔄 Request to switch from ${userRole} to ${newRole}`);

    // Validate the new role
    const validRoles = ['admin', 'creator', 'analyst', 'manager', 'client'];
    if (!validRoles.includes(newRole)) {
      console.log(`❌ Invalid role requested: ${newRole}`);
      return NextResponse.json(
        { 
          error: `Invalid role: ${newRole}`,
          validRoles,
          received: newRole
        },
        { status: 400 }
      );
    }

    // CRITICAL: Only allow role switching for admin users
    if (userRole !== "admin") {
      console.log(`❌ Non-admin user (${userRole}) tried to switch roles`);
      return NextResponse.json(
        { 
          error: "Only administrators can switch roles",
          currentRole: userRole,
          requestedRole: newRole,
          allowed: false
        },
        { status: 403 }
      );
    }

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: `Role switched from ${userRole} to ${newRole}`,
      data: {
        newRole,
        previousRole: userRole,
        timestamp: new Date().toISOString()
      }
    });
    
    // Store original role if admin is switching to another role
    // Only store original role if it doesn't already exist
   // Inside your switch-role API POST function:

// Store original role if admin is switching to another role
// Only store original role if it doesn't already exist
if (userRole === "admin" && newRole !== "admin") {
  const existingOriginalRole = cookieStore.get('original-role')?.value;
  if (!existingOriginalRole) {
    console.log(`📝 Storing original admin role for future reset`);
    response.cookies.set({
      name: 'original-role',
      value: userRole, // Store the original admin role
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}

// Clear original role if switching back to admin
if (newRole === "admin") {
  console.log(`🗑️ Clearing original role cookie (switching back to admin)`);
  response.cookies.delete('original-role');
}
    // Update the user-role cookie
    response.cookies.set({
      name: 'user-role',
      value: newRole,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log(`✅ Cookie updated: user-role = ${newRole}`);
    if (userRole === "admin" && newRole !== "admin" && !originalRole) {
      console.log(`✅ Original role stored: original-role = ${userRole}`);
    }
    console.log("✅ Role switch successful!");

    return response;
    
  } catch (error) {
    console.error("❌ Switch role error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}