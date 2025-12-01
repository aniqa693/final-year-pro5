import { NextResponse } from "next/server";
import { getSession,switchRole } from "../../../../../lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newRole } = await request.json();

    console.log('Switch role request:', { session, newRole });

    // Check if the requested role is available for this user
    if (!session.availableRoles.includes(newRole)) {
      return NextResponse.json(
        { 
          error: "You don't have permission to switch to this role",
          availableRoles: session.availableRoles,
          requestedRole: newRole
        },
        { status: 403 }
      );
    }

    // Switch role in session
    await switchRole(newRole);

    return NextResponse.json({ 
      success: true, 
      message: `Role switched to ${newRole}`,
      newRole,
      availableRoles: session.availableRoles
    });
  } catch (error) {
    console.error("Switch role error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}