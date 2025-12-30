// app/api/user/reset-to-admin/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Get cookies
    const cookieStore = await cookies();
    const userRole = cookieStore.get('user-role')?.value;
    const originalRole = cookieStore.get('original-role')?.value;
    
    console.log("🔄 Reset to admin API called");
    console.log("🔧 Current user role:", userRole);
    console.log("🔧 Original role:", originalRole);
    console.log("🔧 All cookies:", cookieStore.getAll());

    if (!userRole) {
      console.log("❌ No user role found in cookies");
      return NextResponse.json({ 
        error: "Unauthorized - No user role found" 
      }, { status: 401 });
    }

    // Check if user has an original admin role to reset to
    if (!originalRole) {
      console.log(`❌ Cannot reset: no original role found`);
      return NextResponse.json(
        { 
          error: "Cannot reset to admin - no original role found",
          currentRole: userRole,
          allowed: false
        },
        { status: 403 }
      );
    }

    if (originalRole !== "admin") {
      console.log(`❌ Cannot reset: original role is not admin (${originalRole})`);
      return NextResponse.json(
        { 
          error: "Cannot reset to admin - original role is not admin",
          currentRole: userRole,
          originalRole: originalRole,
          allowed: false
        },
        { status: 403 }
      );
    }

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: `Successfully reset from ${userRole} back to admin`,
      data: {
        newRole: "admin",
        previousRole: userRole,
        originalRole: originalRole,
        timestamp: new Date().toISOString()
      }
    });
    
    // Clear the original-role cookie since we're resetting back
    response.cookies.delete('original-role');
    
    // Set user role back to admin
    response.cookies.set({
      name: 'user-role',
      value: 'admin',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    
    console.log(`✅ Reset successful: user-role = admin`);
    console.log(`✅ Original role cookie cleared`);
    
    return response;
    
  } catch (error) {
    console.error("❌ Reset to admin error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}