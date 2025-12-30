import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user-role')?.value;
  const userEmail = cookieStore.get('user-email')?.value;
  const availableRoles = cookieStore.get('available-roles')?.value;

  if (!userEmail || !userRole) {
    return null;
  }

  return {
    email: userEmail,
    role: userRole,
    availableRoles: availableRoles ? JSON.parse(availableRoles) : [userRole],
  };
}

export async function setSession(email: string, role: string, availableRoles: string[] = [role]) {
  const cookieStore = await cookies();
  
  cookieStore.set("user-email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("user-role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("available-roles", JSON.stringify(availableRoles), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function switchRole(newRole: string) {
  const cookieStore = await cookies();
  
  cookieStore.set("user-role", newRole, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  
  ['user-email', 'user-role', 'available-roles'].forEach(cookieName => {
    cookieStore.set(cookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });
  });
}